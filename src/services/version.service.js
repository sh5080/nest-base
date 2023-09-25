import 'dotenv/config';
import Logger from '../configs/logger.config.js';
import sequelize from '../configs/sequelize.config.js';
import { QueryTypes } from 'sequelize';
import { statusCode, message } from '../utils/http.util.js';

const returnResponse = {
  status: statusCode.OK,
  success: true,
  message: message.READ_POST_SUCCESS,
};

// * 버전체크
const versionCheck = async (user_version, os) => {
  try {
    const sql = `
      SELECT is_force, version 
      FROM Version
      WHERE os = '${os}' AND version = '${user_version}'
      LIMIT 1;
    `;
    const recentSql = `
      SELECT is_force, version 
      FROM Version
      WHERE os = '${os}'
      ORDER BY id DESC
      LIMIT 1;
    `;
    const version = await sequelize.query(sql, { type: QueryTypes.SELECT });
    const recentVersion = await sequelize.query(recentSql, { type: QueryTypes.SELECT });
    if (version.length > 0) {
      if (recentVersion[0].version == user_version) {
        returnResponse.status = 200;
        returnResponse.success = true;
        returnResponse.message = message.READ_POST_SUCCESS;
        return returnResponse;
      } else {
        console.log(recentVersion[0].version == user_version);
        returnResponse.status = 400;
        returnResponse.success = false;
        returnResponse.message = message.READ_POST_SUCCESS;
        returnResponse.data = recentVersion[0];
        return returnResponse;
      }
    } else {
      returnResponse.status = 401;
      returnResponse.success = false;
      returnResponse.message = message.NOT_FOUND;
      return returnResponse;
    }
  } catch (error) {
    Logger.error(error);
  }
};

export default { versionCheck };
