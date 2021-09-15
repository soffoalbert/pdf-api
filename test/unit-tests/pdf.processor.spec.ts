import { PDFProcessor } from '../../src/components/pdf_processor/pdf.processor';
import { createClient } from 'redis-mock';

jest.mock('https');
jest.mock('fs');

describe('PDF processor Unit Tests', () => {
    test.skip('should process the PDF link and notify client', async () => {
        const dbClient = {
            getConnection: jest.fn().mockImplementation(() => {
                return {
                    getRepository: jest.fn().mockImplementation(() => {
                        return {
                            save: jest.fn().mockResolvedValue({ pdfUrl: 'test-url', processed: false }),
                        };
                    }),
                    close: jest.fn()
                };
            })
        };

        const redisClient = {
            getClient: createClient
        };

        const socketIOServer = {
            on: jest.fn().mockResolvedValue({ pdfUrl: 'test-url', processed: false })
        };

        await new PDFProcessor(dbClient, redisClient).listen(socketIOServer);
        expect(redisClient.getClient).toBeCalled();
        expect(dbClient.getConnection).toBeCalled();
    });
});
