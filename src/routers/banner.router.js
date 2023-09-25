import { Router } from 'express';
import { BannerController } from '../controllers/index.controller.js';

const router = Router();

router.route('/community/ad').get(BannerController.findCommunityAdBanner);

export default router;
