import { Response } from 'supertest';
import { IPDFHandler } from '../../src/components/pdf_handler/pdf.handler';

const request = require('supertest');
const app = require('../../src/config/server/server').default;

/**
 * API tests
 */
describe('store PDF Test', () => {
    const SERVICE_URL = 'http://localhost:3000';

    it('should store and publish pdf link', (done) => {
        const TMP = Math.random();

        request(SERVICE_URL)
            .post('/v1/store')
            .send({    pdfUrl:`https://iwe-mobile.s3.eu-central-1.amazonaws.com/${TMP}001e33c4-3166-44c9-9bc8-5b20058950d.jpg` })
            .set('Accept', 'application/json')
            .expect((res: Response) => {
                expect(res.status).toEqual(201);
                expect(res.body).toBeTruthy();
            })
            .end(done);
    });

    it('should return a 400 HTTP response code', (done) => {

        request(SERVICE_URL)
            .post('/v1/store')
            .send({    pdfUrl:'https://iwe-mobile.s3.eu-central-1.amazonaws.com/001e33c4-3166-44c9-9bc8-5b20058950d.jpg' })
            .set('Accept', 'application/json')
            .expect((res: Response) => {
                expect(res.status).toEqual(400);
                expect(res.body).toBeTruthy();
            })
            .end(done);
    });

    it('should list all processed pdf links', (done) => {
        request(SERVICE_URL)
            .get('/v1/list')
            .expect((res: Response) => {
                expect(res.status).toEqual(200);
                expect(res.body).toBeTruthy();
            })
            .end(done);
    });
});
