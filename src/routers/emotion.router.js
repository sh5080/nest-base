import { Router } from 'express';
import { EmotionController } from '../controllers/index.controller.js';
import authCheck from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/record').post(authCheck, EmotionController.recordEmotion);
router.route('/').post(authCheck, EmotionController.userEmotions);
router.route('/:_emotion_id').delete(EmotionController.deleteEmotion);

export default router;
