import { Router } from 'express';
import { findAll, store } from '../components/pdf_handler/pdf.component';

/**
 * @constant {express.Router}
 */
const router: Router = Router();

/**
 * @description
 *  store and publishes the pdf record for processing.
 * @constructs
 */
router.post('/store', store);

/**
 * @description finds all pdf records
 * @constructs
 */
router.get('/list', findAll);

export default router;
