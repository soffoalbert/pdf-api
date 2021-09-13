import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../config/container/types';
import { DbClient } from '../../config/clients/db.client';
import { Connection, Repository } from 'typeorm';

import { WriteStream, createWriteStream } from 'fs';
import { PDFRecord } from '../pdf_handler/pdf.record.model';
import config from '../../config/env/index';
import { IRedisClient } from '../../config/clients/redis.client';
import { RedisClient } from 'redis';
import { get } from 'https';
import { Server } from 'socket.io';

export interface IPDFProcessor {
    process(pdfRecord: PDFRecord): Promise<void>;
    listen(server: Server): void;
}

@injectable()
export class PDFProcessor implements IPDFProcessor {

    private  connection:Connection;
    private  socketIOServer:Server;

    public constructor(
        @inject(TYPES.IDBClient) private DBClient: DbClient, @inject(TYPES.IRedisClient) private redisClient: IRedisClient
    ) {}

    listen(socketIOServer: Server): void {
        const redisClient: RedisClient =  this.redisClient.getClient();

        this.socketIOServer = socketIOServer;
        redisClient.subscribe('processPDF', (error, channel):void => {
            if (error) {
                throw new Error(error.message);
            }
            console.log(`Subscribed to ${channel} channel. Listening for updates on the ${channel} channel...`);
        });

        redisClient.on('message', async (channel:string, message:string): Promise<void> => {
            console.log(`Message for url ${JSON.parse(message).pdfUrl} received from to the message broker`);

            await this.process(JSON.parse(message));

        });

    }
    async process(pdf: PDFRecord): Promise<void> {
        try {
            this.connection = await this.DBClient.getConnection();

            const pdfRecordRepository:Repository<PDFRecord> = this.connection.getRepository(PDFRecord);
            const recordToUpdate: PDFRecord = await pdfRecordRepository.findOne(pdf.id);

            await this.downloadFile(pdf.pdfUrl);

            recordToUpdate.processed = true;
            await pdfRecordRepository.save(recordToUpdate);

        } catch (error) {
            console.error(`Failed to update the pdf record and download the file from  ${pdf.pdfUrl} `, error);
            throw error;
        } finally {
            await this.connection.close();
        }

    }

    async downloadFile(url: string): Promise<void> {
        get(url, (response): void => {
            const fileStream: WriteStream = createWriteStream(config.filePath);

            response.pipe(fileStream)
                .on('close',  ():void => {
                    console.log(`File ${url} written to ${config.filePath}`);
                    this.socketIOServer.on('connection', (socket): void => {
                        socket.emit('processedPDF', `File ${url} has being successfully processed`);
                        console.log(`File ${url} notification has being emitted to the client`);
                    });
                });
        });
    }
}
