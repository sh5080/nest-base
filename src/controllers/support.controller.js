import { SupportService } from '../services/index.service.js';
import { statusCode, message, isSuccess } from '../utils/http.util.js';

const supports = async (req, res, next) => {
  try {
    const user_id = req.user_id;
    const organization = req.body.organization;
    // * Validate user input
    if (!user_id) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(isSuccess.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }
    const data = await SupportService.supports(user_id, organization);
    res
      .status(statusCode.OK)
      .json(isSuccess.success(statusCode.OK, message.READ_POST_SUCCESS, data));
  } catch (error) {
    next(error);
  }
};

const bookmarkSupport = async (req, res, next) => {
  try {
    const user = req.user_id;
    const support_id = req.body.support_id;
    // * Validate terms input
    if (!user || !support_id) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(isSuccess.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }
    await SupportService.bookmarkSupport(user, support_id);
    res
      .status(statusCode.OK)
      .json(isSuccess.success(statusCode.OK, message.UPDATE_POST_SUCCESS));
  } catch (error) {
    next(error);
  }
};

const findBySupportId = async (req, res, next) => {
  try {
    const user_id = req.user_id;
    const _support_id = req.params._support_id;
    // * Validate user input
    if (!user_id) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(isSuccess.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }
    const data = await SupportService.findBySupportId(user_id, _support_id);
    res
      .status(statusCode.OK)
      .json(isSuccess.success(statusCode.OK, message.READ_POST_SUCCESS, data));
  } catch (error) {
    next(error);
  }
};

const userBookmarkSupport = async (req, res, next) => {
  try {
    const user_id = req.user_id;
    // * Validate user input
    if (!user_id) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(isSuccess.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }
    const data = await SupportService.userBookmarkSupport(user_id);
    res
      .status(statusCode.OK)
      .json(isSuccess.success(statusCode.OK, message.READ_POST_SUCCESS, data));
  } catch (error) {
    next(error);
  }
};

export default {
  supports,
  bookmarkSupport,
  findBySupportId,
  userBookmarkSupport,
};
