import { UserService } from '../services/index.service.js';
import { statusCode, message, isSuccess } from '../utils/http.util.js';

const isUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    // * Validate user input
    if (!email) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(isSuccess.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }
    const returnData = await UserService.isUser(email);
    if (returnData.status == 200) {
      const { status, success, message, data } = returnData;
      res.status(status).json({ status, success, message, data });
    } else if (returnData.status == 401) {
      const { status, success, message } = returnData;
      res.status(status).json({ status, success, message });
    }
  } catch (error) {
    next(error);
  }
};

const isNickName = async (req, res, next) => {
  try {
    const nickname = req.body.nickname;
    // * Validate user input
    if (!nickname) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(isSuccess.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }
    const returnData = await UserService.isNickName(nickname);
    if (returnData.status == 200) {
      const { status, success, message } = returnData;
      res.status(status).json({ status, success, message });
    } else if (returnData.status == 401) {
      const { status, success, message } = returnData;
      res.status(status).json({ status, success, message });
    }
  } catch (error) {
    next(error);
  }
};

const signUp = async (req, res, next) => {
  try {
    const nickname = req.body.nickname;
    const email = req.body.email;
    const year = req.body.year;
    const birthday = req.body.birthday;
    const auth_type = req.body.auth_type;
    const terms = req.body.terms;
    const due_date = req.body.due_date;
    const form = req.body.form;
    const weight = req.body.weight;
    const height = req.body.height;
    const is_pregnant = req.body.is_pregnant;
    // * Validate user input
    if (
      !nickname ||
      !email ||
      !auth_type ||
      !terms ||
      !weight ||
      !height ||
      is_pregnant == undefined
    ) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(isSuccess.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }
    const returnData = await UserService.signUp(
      nickname,
      email,
      year,
      birthday,
      auth_type,
      due_date,
      form,
      weight,
      height,
      is_pregnant,
      terms
    );
    if (returnData.status == 201) {
      const { status, success, message, data } = returnData;
      res.status(status).json({ status, success, message, data });
    } else {
      const { status, success, message } = returnData;
      res.status(status).json({ status, success, message });
    }
  } catch (error) {
    next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const uuid = req.body.uuid;
    const email = req.body.email;
    // * Validate user input
    if (!uuid || !email) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(isSuccess.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }
    const returnData = await UserService.signIn(uuid, email);
    if (returnData.status == 200) {
      const { status, success, message, data } = returnData;
      res.status(status).json({ status, success, message, data });
    } else {
      const { status, success, message } = returnData;
      res.status(status).json({ status, success, message });
    }
  } catch (error) {
    next(error);
  }
};

const updateUserInfo = async (req, res, next) => {
  try {
    const user_id = req.user_id;
    const updateDto = req.body;
    // * Validate user input
    if (!user_id) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(isSuccess.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }
    await UserService.updateUserInfo(user_id, updateDto);
    res
      .status(statusCode.OK)
      .json(isSuccess.success(statusCode.OK, message.UPDATE_POST_SUCCESS));
  } catch (error) {
    next(error);
  }
};

const updateProfileImage = async (req, res, next) => {
  try {
    const user_id = req.user_id;
    const image_url = req.file.location;
    // * Validate user input
    if (!user_id) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(isSuccess.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }
    await UserService.updateProfileImage(user_id, image_url);
    const data = {};
    data.profile_image_url = image_url;
    res
      .status(statusCode.OK)
      .json(
        isSuccess.success(statusCode.OK, message.UPDATE_POST_SUCCESS, data)
      );
  } catch (error) {
    next(error);
  }
};

const userType = async (req, res, next) => {
  try {
    const user_id = req.user_id;
    // * Validate user input
    if (!user_id) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(isSuccess.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }
    const data = await UserService.userType(user_id);
    res
      .status(statusCode.OK)
      .json(isSuccess.success(statusCode.OK, message.READ_POST_SUCCESS, data));
  } catch (error) {
    next(error);
  }
};

const updateFcmToken = async (req, res, next) => {
  try {
    const user_id = req.user_id;
    const fcm_token = req.body.fcm_token;
    // * Validate user input
    if (!user_id || !fcm_token) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(isSuccess.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }
    await UserService.updateFcmToken(user_id, fcm_token);
    res
      .status(statusCode.OK)
      .json(isSuccess.success(statusCode.OK, message.UPDATE_POST_SUCCESS));
  } catch (error) {
    next(error);
  }
};

const userWithdrawal = async (req, res, next) => {
  try {
    const user_id = req.user_id;
    // * Validate user input
    if (!user_id) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(isSuccess.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }
    await UserService.userWithdrawal(user_id);
    res
      .status(statusCode.OK)
      .json(isSuccess.success(statusCode.OK, message.DELETE_POST_SUCCESS));
  } catch (error) {
    next(error);
  }
};

export default {
  isUser,
  isNickName,
  signUp,
  signIn,
  updateUserInfo,
  updateProfileImage,
  userType,
  updateFcmToken,
  userWithdrawal,
};
