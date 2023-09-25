import { Router } from 'express';
import { UserController } from '../controllers/index.controller.js';
import authCheck from '../middlewares/auth.middleware.js';
import { ProfileImageUpload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/decide').post(UserController.isUser);
router.route('/nickname').post(UserController.isNickName);
router.route('/signup').post(UserController.signUp);
router.route('/signin').post(UserController.signIn);
router.route('/type').get(authCheck, UserController.userType);
router
  .route('/info')
  .put(authCheck, UserController.updateUserInfo)
  .patch(authCheck, UserController.updateFcmToken);
router
  .route('/profile')
  .patch(
    authCheck,
    ProfileImageUpload.single('image'),
    UserController.updateProfileImage
  );
router.route('/').delete(authCheck, UserController.userWithdrawal);

export default router;
