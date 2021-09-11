import * as express from 'express';
import * as http from 'http';
import PDFRouter from './pdf.router';

/**
 * @export
 * @param {express.Application} app
 */
export function init(app: express.Application): void {
    const router: express.Router = express.Router();

    /**
     * @description
     *  handles the pdf record for processing and reading.
     * @constructs
     */
    app.use('/v1', PDFRouter);

    /**
     * @description No results returned mean the object is not found
     * @constructs
     */
    app.use((req, res, next): void => {
        res.status(404).send(http.STATUS_CODES[404]);
    });

    /**
     * @constructs all routes
     */
    app.use(router);
}
