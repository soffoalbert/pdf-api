import * as debug from 'debug';
import { Address } from 'cluster';
import { IPDFHandler } from '../../components/pdf_handler/pdf.handler';
import { Bootstrap } from '../container/Bootstrap';
import { Container } from 'inversify';
import { TYPES } from '../container/types';
import { IPDFProcessor } from '../../components/pdf_processor/pdf.processor';

/**
 * @param  {NodeJS.ErrnoException} error
 * @param  {number|string|boolean} port
 * @returns throw error
 */
export function onError(error: NodeJS.ErrnoException, port: number | string | boolean): void {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind: string = (typeof port === 'string') ? `Pipe ${port}` : `Port ${port}`;

    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);

            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);

            break;
        default:
            throw error;
    }
}

/**
 * @export onListening
 */
export function onListening(): void {
    const container:Container = Bootstrap.createContainer();
    const pdfProcessor:IPDFProcessor =  container.get<IPDFProcessor>(TYPES.IPDFProcessor);

    pdfProcessor.listen();
    const addr: Address = this.address();
    const bind: string = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;

    console.log(`Listening on ${bind}`);
}
