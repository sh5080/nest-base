import { statusCode, message, isSuccess } from '../utils/http.util.js';
import { BannerService } from '../services/index.service.js';

const findCommunityAdBanner = async (req, res, next) => {
  try {
    const data = await BannerService.findCommunityAdBanner();
    res
      .status(statusCode.OK)
      .json(isSuccess.success(statusCode.OK, message.READ_POST_SUCCESS, data));
  } catch (error) {
    next(error);
  }
};

export default { findCommunityAdBanner };
