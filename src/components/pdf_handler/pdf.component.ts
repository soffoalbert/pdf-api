import { NextFunction, Request, Response } from 'express';
import { Container } from 'inversify';
import { TYPES } from '../../config/container/types';
import { IPDFHandler } from './pdf.handler';
import { PDFRecord } from './pdf.record.model';
import { Bootstrap } from '../../config/container/Bootstrap';

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

        res.status(201).json(pdfRecord);
    } catch (error) {
        next(JSON.stringify({ status: error.message.status, message: error.message }));
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

        res.status(200).json(pdfRecords);
    } catch (error) {
        next({ status: error.message.status, message: error.message });
    }
}
