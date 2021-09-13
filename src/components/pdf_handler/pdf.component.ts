import { NextFunction, Request, Response } from 'express';
import { Container } from 'inversify';
import { TYPES } from '../../config/container/types';
import { IPDFHandler } from './pdf.handler';
import { PDFRecord } from './pdf.record.model';
import { Bootstrap } from '../../config/container/Bootstrap';
import { DuplicateException } from './duplicate.exception';
import statusCode from 'http-status-codes';

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function store(req: Request, res: Response, next: NextFunction): Promise < void > {

    const container:Container = Bootstrap.createContainer();
    const pdfHandler:IPDFHandler =  container.get<IPDFHandler>(TYPES.IPDFHandler);

    try {
        console.log(`received request to process URL: ${req.body}`);
        const pdfRecord: PDFRecord = await pdfHandler.handle(req.body);

        res.status(statusCode.CREATED).json(pdfRecord);
    } catch (error) {
        if (error instanceof DuplicateException) {
            res.status(statusCode.BAD_REQUEST).json({ message: error.message, statusCode: statusCode.BAD_REQUEST });
        }
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: error.message, statusCode: statusCode.INTERNAL_SERVER_ERROR });
    }
}

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function findAll(req: Request, res: Response, next: NextFunction): Promise < void > {
    const container:Container = Bootstrap.createContainer();
    const pdfHandler:IPDFHandler =  container.get<IPDFHandler>(TYPES.IPDFHandler);

    try {
        const pdfRecords: PDFRecord[] = await pdfHandler.list();

        res.status(statusCode.OK).json(pdfRecords);
    } catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: error.message, statusCode: statusCode.INTERNAL_SERVER_ERROR });
    }
}
