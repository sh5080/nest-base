import dotenv from 'dotenv';
dotenv.config();
import { isSuccess, statusCode, message } from '../utils/http.util.js';
import jwt from 'jsonwebtoken';

const authCheck = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(statusCode.FORBIDDEN)
      .json(isSuccess.fail(statusCode.FORBIDDEN, message.FORBIDDEN));
  }
  try {
    const tokenSecretKey = process.env.JWT_SECRETKEY;
    const decodedData = jwt.verify(token, tokenSecretKey);
    req.user_id = decodedData.id;
    return next();
  } catch (error) {
    next(error);
    if (error.message === 'jwt expired') {
      return res
        .status(statusCode.UNAUTHORIZED)
        .json(isSuccess.fail(statusCode.UNAUTHORIZED, message.UNAUTHORIZED));
    }
  }
};

export default authCheck;
