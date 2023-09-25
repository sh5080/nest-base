import 'dotenv/config';
import Logger from '../configs/logger.config.js';
import sequelize from '../configs/sequelize.config.js';
import { QueryTypes } from 'sequelize';

// * 커뮤니티 광고 배너 조회
const findCommunityAdBanner = async () => {
  try {
    const query = `
      SELECT id, title, image_url
      FROM Banner
      WHERE type = 'ad' AND partner = 'test'
    `;
    const data = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return data;
  } catch (error) {
    Logger.error(error);
  }
};

export default { findCommunityAdBanner };
