import {
  isSuccess,
  statusCode,
  message,
  AppError,
} from "../utils/http.util.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    const { status, message, detail } = err;
    const errorResponse = {
      status,
      success: false,
      message,
      //   detail,
      // 서버에서만 확인하기 위해 클라이언트에게는 name만 보여줌
    };
    res.status(status).json(errorResponse);
  } else {
    const errorResponse = isSuccess.fail(
      statusCode.INTERNAL_SERVER_ERROR,
      message.INTERNAL_SERVER_ERROR
    );
    res.status(errorResponse.status).json(errorResponse);
    console.error("non catched in error Handler: ", err);
  }
};
