import { Container, interfaces } from 'inversify';
import { TYPES } from './types';
import { DbClient, IDBClient } from '../clients/db.client';
import { IPDFHandler, PDFHandler } from '../../components/pdf_handler/pdf.handler';
import { IPDFProcessor, PDFProcessor } from '../../components/pdf_processor/pdf.processor';
import { CustomRedisClient, IRedisClient } from '../clients/redis.client';
import { Connection } from 'typeorm';
import { Context } from 'inversify/lib/planning/context';

export class Bootstrap {
    public static createContainer(): Container {
        const pdfAPIContainer: Container = new Container();

        pdfAPIContainer.bind<IDBClient>(TYPES.IDBClient).to(DbClient).inSingletonScope();
        pdfAPIContainer.bind<Promise<Connection>>('Connection')
            .toDynamicValue((context: Context): Promise<Connection> => {
                return context.container.get<IDBClient>(TYPES.IDBClient).getConnection();
            });
        pdfAPIContainer.bind<IPDFHandler>(TYPES.IPDFHandler).to(PDFHandler).inSingletonScope();
        pdfAPIContainer.bind<IPDFProcessor>(TYPES.IPDFProcessor).to(PDFProcessor).inSingletonScope();
        pdfAPIContainer.bind<IRedisClient>(TYPES.IRedisClient).to(CustomRedisClient).inSingletonScope();

        return pdfAPIContainer;
    }
}
