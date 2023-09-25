import { Router } from 'express';
import { NoticeController } from '../controllers/index.controller.js';

const router = Router();

router.route('/').get(NoticeController.findNotices);
router.route('/:_notice_id').get(NoticeController.noticeInfo);

export default router;
