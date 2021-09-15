import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../config/container/types';
import { IDBClient } from '../../config/clients/db.client';
import { Connection, getConnectionManager, getManager, getRepository, Repository } from 'typeorm';
import { PDFRecord } from './pdf.record.model';
import { IRedisClient } from '../../config/clients/redis.client';
import { DuplicateException } from './duplicate.exception';

export interface IPDFHandler {
    handle(pdfRecord: PDFRecord): Promise<PDFRecord>;

    list(): Promise<PDFRecord[]>;
}

@injectable()
export class PDFHandler implements IPDFHandler {
    private pdfRecord: PDFRecord;

    public constructor(
        @inject(TYPES.IDBClient) private DBClient: IDBClient, @inject(TYPES.IRedisClient) private redisClient: IRedisClient
    ) {
    }

    private getRepository(): Repository<PDFRecord> {
        if (this.DBClient) {
            return this.DBClient.getConnection().getRepository(PDFRecord);
        }

        return getRepository(PDFRecord);
    }

    async handle(pdf: PDFRecord): Promise<PDFRecord> {
        if (await this.isDuplicate(pdf.pdfUrl)) {
            throw new DuplicateException(`File ${pdf.pdfUrl} Already exists.`);
        }
        try {
            pdf.processed = false;
            this.pdfRecord = await this.getRepository().save(pdf);

            this.publishMessage(this.pdfRecord);
        } catch (error) {
            console.error(`Failed to store and publish message ${error} `);
            throw error;
        }

        return this.pdfRecord;
    }

    private publishMessage(pdfRecord: PDFRecord): void {
        this.redisClient.getClient().publish('processPDF', JSON.stringify(pdfRecord), (): void => {
            console.log(`Message for url ${pdfRecord.pdfUrl} sent to the message broker`);
        });
    }

    async list(): Promise<PDFRecord[]> {
        return await this.getRepository().find();
    }

    private async isDuplicate(pdfUrl: string): Promise<boolean> {
        const pdfRecord: PDFRecord = await this.getRepository()
                .createQueryBuilder('PDFRecord')
                .where({ pdfUrl })
                .getOne();

        return !!pdfRecord;
    }
}
