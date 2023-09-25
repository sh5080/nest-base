import { Router } from 'express';
import { SupportController } from '../controllers/index.controller.js';
import authCheck from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/user').get(authCheck, SupportController.userBookmarkSupport);
router.route('/').post(authCheck, SupportController.supports);
router.route('/:_support_id').get(authCheck, SupportController.findBySupportId);
router.route('/bookmark').post(authCheck, SupportController.bookmarkSupport);

export default router;
