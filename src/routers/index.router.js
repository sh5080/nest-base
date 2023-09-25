import morgan from 'morgan';
import UserRouter from './user.router.js';
import TermRouter from './term.router.js';
import VersionRouter from './version.router.js';
import BannerRouter from './banner.router.js';
import NoticeRouter from './notice.router.js';
import SupportRouter from './support.router.js';
import EmotionRouter from './emotion.router.js';
import express from 'express';
const app = express();

app.use(morgan('short'));
app.use('/user', UserRouter);
app.use('/term', TermRouter);
app.use('/version', VersionRouter);
app.use('/banner', BannerRouter);
app.use('/notice', NoticeRouter);
app.use('/support', SupportRouter);
app.use('/emotion', EmotionRouter);

// * 404 에러처리
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    success: false,
    message: '404 Not Found',
  });
});

app.use((error, req, res, next) => {
  // * jwt 인증에러는 403 권한없음 statuscode 반환
  res.status(error.name == 'JsonWebTokenError' ? 403 : 400).json({
    status: error.name == 'JsonWebTokenError' ? 403 : 400,
    success: false,
    message: error.message,
  });
  error.name == 'JsonWebTokenError' ? false : console.error(error.message);
});

export default app;
