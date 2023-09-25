import { statusCode, message, isSuccess } from '../utils/http.util.js';
import { EmotionService } from '../services/index.service.js';

const recordEmotion = async (req, res, next) => {
  try {
    const user_id = req.user_id;
    const level = req.body.level;
    await EmotionService.recordEmotion(user_id, level);
    res
      .status(statusCode.OK)
      .json(isSuccess.success(statusCode.OK, message.CREATE_POST_SUCCESS));
  } catch (error) {
    next(error);
  }
};

const userEmotions = async (req, res, next) => {
  try {
    const user_id = req.user_id;
    const created_month = req.body.created_month;
    const data = await EmotionService.userEmotions(user_id, created_month);
    res
      .status(statusCode.OK)
      .json(isSuccess.success(statusCode.OK, message.READ_POST_SUCCESS, data));
  } catch (error) {
    next(error);
  }
};

const deleteEmotion = async (req, res, next) => {
  try {
    const _emotion_id = req.params._emotion_id;
    await EmotionService.deleteEmotion(_emotion_id);
    res
      .status(statusCode.OK)
      .json(isSuccess.success(statusCode.OK, message.DELETE_POST_SUCCESS));
  } catch (error) {
    next(error);
  }
};

export default { recordEmotion, userEmotions, deleteEmotion };
