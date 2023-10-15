import { MemoService } from "../services/index.service.js";
import {
  statusCode,
  message,
  isSuccess,
  AppError,
} from "../utils/http.util.js";

//메모 생성
const createMemo = async (req, res, next) => {
  try {
    const user_id = 251;
    // req.user_id;
    const { memo, record_date, record_time } = req.body;

    if (!user_id) {
      throw new AppError(
        statusCode.BAD_REQUEST,
        message.BAD_REQUEST,
        "로그인이 필요합니다."
      );
      return res
        .status(statusCode.BAD_REQUEST)
        .json(isSuccess.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }
    await MemoService.createMemo(user_id, memo, record_date, record_time);
    res
      .status(statusCode.OK)
      .json(isSuccess.success(statusCode.OK, message.CREATE_POST_SUCCESS));
  } catch (error) {
    next(error);
  }
};

// 전체 메모 조회
const getMemo = async (req, res, next) => {
  try {
    const user = 252;

    if (!user) {
      throw new AppError(
        statusCode.BAD_REQUEST,
        message.BAD_REQUEST,
        "로그인이 필요합니다."
      );
      return res
        .status(statusCode.BAD_REQUEST)
        .json(isSuccess.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }
    const resultData = await MemoService.getMemo(user);

    res
      .status(statusCode.OK)
      .json(
        isSuccess.success(statusCode.OK, message.READ_POST_SUCCESS, resultData)
      );
  } catch (error) {
    next(error);
  }
};
// 특정 메모 조회
const getOneMemo = async (req, res, next) => {
  try {
    const user = 251;
    const id = req.params.id;

    if (!user) {
      throw new AppError(
        statusCode.BAD_REQUEST,
        message.BAD_REQUEST,
        "로그인이 필요합니다."
      );
      return res
        .status(statusCode.BAD_REQUEST)
        .json(isSuccess.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }
    const resultData = await MemoService.getOneMemo(user, id);

    res
      .status(statusCode.OK)
      .json(
        isSuccess.success(statusCode.OK, message.READ_POST_SUCCESS, resultData)
      );
  } catch (error) {
    next(error);
  }
};

// 메모 수정
const updateMemo = async (req, res, next) => {
  try {
    // const user_id = req.user_id;
    const user_id = 251;
    const id = req.params.id;
    const memo = req.body.memo;

    if (!user_id) {
      throw new AppError(
        statusCode.BAD_REQUEST,
        message.BAD_REQUEST,
        "로그인이 필요합니다."
      );
      return res
        .status(statusCode.BAD_REQUEST)
        .json(isSuccess.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }
    await MemoService.updateMemo(user_id, id, memo);

    res
      .status(statusCode.OK)
      .json(isSuccess.success(statusCode.OK, message.UPDATE_POST_SUCCESS));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const deleteMemo = async (req, res, next) => {
  try {
    // const user_id = req.user_id;
    const user_id = 251;
    const id = req.params.id;

    if (!user_id) {
      throw new AppError(
        statusCode.BAD_REQUEST,
        message.BAD_REQUEST,
        "로그인이 필요합니다."
      );
      return res
        .status(statusCode.BAD_REQUEST)
        .json(isSuccess.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }
    await MemoService.deleteMemo(user_id, id);
    res
      .status(statusCode.OK)
      .json(isSuccess.success(statusCode.OK, message.DELETE_POST_SUCCESS));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default {
  createMemo,
  getMemo,
  getOneMemo,
  updateMemo,
  deleteMemo,
};
