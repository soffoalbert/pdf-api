import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../config/container/types';
import { IDBClient } from '../../config/clients/db.client';
import { Connection, Repository } from 'typeorm';
import { PDFRecord } from './pdf.record.model';
import { IRedisClient } from '../../config/clients/redis.client';

export interface IPDFHandler {
    handle(pdfRecord: PDFRecord): Promise<PDFRecord>;
    list(): Promise<PDFRecord[]>;
}

@injectable()
export class PDFHandler implements IPDFHandler {
    private  connection:Connection;
    private pdfRecord: PDFRecord;
    public constructor(
        @inject(TYPES.IDBClient) private DBClient: IDBClient, @inject(TYPES.IRedisClient) private redisClient:IRedisClient
    ) {}
    async handle(pdf: PDFRecord): Promise<PDFRecord> {
        try {
            this.connection = await this.DBClient.getConnection();

            const pdfRecordRepository:Repository<PDFRecord> = this.connection.getRepository(PDFRecord);

            pdf.processed = false;
            this.pdfRecord = await pdfRecordRepository.save(pdf);

            this.publishMessage(this.pdfRecord);
        } catch (error) {
            console.error(`Failed to store and publish message ${error} `);
            throw error;
        } finally {
            await this.connection.close();
        }

        return this.pdfRecord;
    }

    publishMessage(pdfRecord: PDFRecord): void {
        this.redisClient.getClient().publish('processPDF', JSON.stringify(pdfRecord), (): void => {
            console.log(`Message for url ${pdfRecord.pdfUrl} sent to the message broker`);
        });
    }

    async list(): Promise<PDFRecord[]> {
        this.connection = await this.DBClient.getConnection();

        const pdfRecordRepository:Repository<PDFRecord> = this.connection.getRepository(PDFRecord);

        return await pdfRecordRepository.find();
    }
}
