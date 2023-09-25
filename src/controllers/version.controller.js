import { VersionService } from '../services/index.service.js';

const versionCheck = async (req, res, next) => {
  try {
    const user_version = req.body.version;
    const os = req.body.os;
    const returnData = await VersionService.versionCheck(user_version, os);
    if (returnData.status == 200) {
      const { status, success, message } = returnData;
      res.status(status).json({ status, success, message });
    } else if (returnData.status == 400) {
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

export default { versionCheck };
