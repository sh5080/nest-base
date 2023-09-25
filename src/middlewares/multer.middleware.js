import dotenv from 'dotenv';
dotenv.config();
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import moment from 'moment-timezone';
import Logger from '../configs/logger.config.js';

const S3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_IAM_ACCESSKEY,
    secretAccessKey: process.env.AWS_IAM_SECRETKEY,
  },
  region: process.env.AWS_REGION,
});

export const ArticleImageUpload = multer({
  storage: multerS3({
    s3: S3,
    bucket: process.env.AWS_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    shouldTransform: true,
    key: (req, file, cd) => {
      cd(
        null,
        `bayabas-ai/community/scalp-cls/${moment().format('YYYY-MM-DD')}_${file.originalname}`,
      );
    },
  }),
});

export const DeleteArticleImage = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
  });
  try {
    await S3.send(command);
  } catch (error) {
    Logger.error(error);
  }
};

export const ProfileImageUpload = multer({
  storage: multerS3({
    s3: S3,
    bucket: process.env.AWS_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    shouldTransform: true,
    key: (req, file, cd) => {
      cd(null, `bayabas/profile/users/${moment().format('YYYY-MM-DD')}_${file.originalname}`);
    },
  }),
});
