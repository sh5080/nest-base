import { Router } from 'express';
import { TermController } from '../controllers/index.controller.js';
import authCheck from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/').get(TermController.terms);
router.route('/:_term_id').get(TermController.findByTermId);
router.route('/user').put(authCheck, TermController.updateUserTerm);

export default router;
