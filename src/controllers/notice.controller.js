import { statusCode, message, isSuccess } from '../utils/http.util.js';
import { NoticeService } from '../services/index.service.js';

const findNotices = async (req, res, next) => {
  try {
    const page_query = req.query.page;
    const limit_query = req.query.limit;
    const data = await NoticeService.findNotices(page_query, limit_query);
    res
      .status(statusCode.OK)
      .json(isSuccess.success(statusCode.OK, message.READ_POST_SUCCESS, data));
  } catch (error) {
    next(error);
  }
};

const noticeInfo = async (req, res, next) => {
  try {
    const notcie_id = req.params._notice_id;
    const data = await NoticeService.noticeInfo(notcie_id);
    res
      .status(statusCode.OK)
      .json(isSuccess.success(statusCode.OK, message.READ_POST_SUCCESS, data));
  } catch (error) {
    next(error);
  }
};

export default { findNotices, noticeInfo };
