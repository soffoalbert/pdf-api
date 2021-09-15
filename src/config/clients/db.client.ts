import { injectable } from 'inversify';
import 'reflect-metadata';

import { createConnection, Connection } from 'typeorm';
import config from '../env/index';
import { PDFRecord } from '../../components/pdf_handler/pdf.record.model';

export interface IDBClient {
    // @ts-ignore
    getConnection();
}

@injectable()
export class DbClient implements IDBClient {
    async getConnection() {
        return await createConnection({
            type: 'postgres',
            host: config.database.host,
            port: Number(config.database.port),
            username: config.database.username,
            password: config.database.password,
            database: config.database.name,
            synchronize: Boolean(config.database.synchronize),
            entities: [PDFRecord],
            extra: {
                connectionLimit: 5
            }
        });
    }
}
