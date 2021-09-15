import { PDFHandler } from '../../src/components/pdf_handler/pdf.handler';
import { DuplicateException } from '../../src/components/pdf_handler/duplicate.exception';
describe('PDF handler Unit Tests', () => {
    test('should store the PDF link and publish it to redis', async () => {
        const dbClient = {
            getConnection: jest.fn().mockImplementation(() => {
                return {
                    getRepository: jest.fn().mockImplementation(() => {
                        return {
                            save: jest.fn().mockResolvedValue({ pdfUrl: 'test-url', processed: false }),
                            createQueryBuilder: jest.fn().mockImplementation(() => {
                                return {
                                    where: jest.fn().mockImplementation(() => {
                                        return {
                                            getOne: jest.fn().mockResolvedValue(undefined)
                                        };
                                    })
                                };
                            })
                        };
                    }),
                    close: jest.fn()
                };
            })
        };

        const redisClient = {
            getClient: jest.fn().mockImplementation(() => {
                return {
                    publish: jest.fn().mockResolvedValue({ pdfUrl: 'test-url', processed: false })
                };
            })
        };
        const pdfHandler = new PDFHandler(dbClient, redisClient);

        expect(await pdfHandler.handle({ pdfUrl: 'test-url', processed: false })).toEqual({ pdfUrl: 'test-url', processed: false });

        expect(dbClient.getConnection).toHaveBeenCalledTimes(2);
        expect(redisClient.getClient).toHaveBeenCalledTimes(1);
    });

    test('should throw a database error', async () => {
        const e = new DuplicateException('a db error occurred');
        const dbClient = {
            getConnection: jest.fn().mockImplementation(() => {
                return {
                    getRepository: jest.fn().mockImplementation(() => {
                        return {
                            save: jest.fn().mockImplementation(() => { throw e; }),
                            createQueryBuilder: jest.fn().mockImplementation(() => {
                                return {
                                    where: jest.fn().mockImplementation(() => {
                                        return {
                                            getOne: jest.fn().mockResolvedValue(undefined)
                                        };
                                    })
                                };
                            })
                        };
                    }),
                    close: jest.fn()
                };
            })
        };

        const redisClient = {
            getClient: jest.fn().mockImplementation(() => {
                return {
                    publish: jest.fn().mockImplementation(() => { throw e; })
                };
            })
        };

        try {
            const pdfHandler = new PDFHandler(dbClient, redisClient);

            await pdfHandler.handle({ pdfUrl: 'test-url', processed: false });
        } catch (err) {
            expect(err).toEqual(e);

        }
    });

    test('should throw a redis error', async () => {
        const e = new DuplicateException('a redis error occurred');
        const dbClient = {
            getConnection: jest.fn().mockImplementation(() => {
                return {
                    getRepository: jest.fn().mockImplementation(() => {
                        return {
                            save: jest.fn().mockResolvedValue({ pdfUrl: 'test-url', processed: false }),
                            createQueryBuilder: jest.fn().mockImplementation(() => {
                                return {
                                    where: jest.fn().mockImplementation(() => {
                                        return {
                                            getOne: jest.fn().mockResolvedValue(undefined)
                                        };
                                    })
                                };
                            })
                        };
                    }),
                    close: jest.fn()
                };
            })
        };

        const redisClient = {
            getClient: jest.fn().mockImplementation(() => {
                return {
                    publish: jest.fn().mockImplementation(() => { throw e; }),
                };
            })
        };

        try {
            const pdfHandler = new PDFHandler(dbClient, redisClient);

            await pdfHandler.handle({ pdfUrl: 'test-url', processed: false });
        } catch (err) {
            expect(err).toEqual(e);

        }

    });

    test('should list all the PDF link records', async () => {
        let redisClient;

        const dbClient = {
            getConnection: jest.fn().mockImplementation(() => {
                return {
                    getRepository: jest.fn().mockImplementation(() => {
                        return {
                            find: jest.fn().mockResolvedValue({ pdfUrl: 'test-url', processed: false }),
                        };
                    }),
                    close: jest.fn()
                };
            })
        };

        redisClient = {
            getClient: jest.fn().mockImplementation(() => {
                return {
                    publish: jest.fn().mockResolvedValue({ pdfUrl: 'test-url', processed: false })
                };
            })
        };
        const pdfHandler = new PDFHandler(dbClient, redisClient);

        expect(await pdfHandler.list()).toEqual({ pdfUrl: 'test-url', processed: false });

        expect(dbClient.getConnection).toHaveBeenCalledTimes(1);
    });
});
