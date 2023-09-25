import { TermService } from '../services/index.service.js';
import { statusCode, message, isSuccess } from '../utils/http.util.js';

const terms = async (req, res, next) => {
  try {
    const data = await TermService.terms();
    res
      .status(statusCode.OK)
      .json(isSuccess.success(statusCode.OK, message.READ_POST_SUCCESS, data));
  } catch (error) {
    next(error);
  }
};

const findByTermId = async (req, res, next) => {
  try {
    const term_id = req.params._term_id;
    const data = await TermService.findByTermId(term_id);
    res
      .status(statusCode.OK)
      .json(isSuccess.success(statusCode.OK, message.READ_POST_SUCCESS, data));
  } catch (error) {
    next(error);
  }
};

const updateUserTerm = async (req, res, next) => {
  try {
    const user = req.user_id;
    const termUpdateDto = req.body;
    // * Validate terms input
    if (!termUpdateDto) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(isSuccess.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }
    await TermService.updateUserTerm(user, termUpdateDto);
    res
      .status(statusCode.OK)
      .json(isSuccess.success(statusCode.OK, message.UPDATE_POST_SUCCESS));
  } catch (error) {
    next(error);
  }
};

export default { terms, findByTermId, updateUserTerm };
