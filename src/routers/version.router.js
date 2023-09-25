import { Router } from 'express';
import { VersionController } from '../controllers/index.controller.js';

const router = Router();

router.route('/').post(VersionController.versionCheck);

export default router;
