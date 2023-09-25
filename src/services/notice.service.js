import 'dotenv/config';
import Logger from '../configs/logger.config.js';
import sequelize from '../configs/sequelize.config.js';
import { QueryTypes } from 'sequelize';

// * 공지 전체 조회 | 페이징 처리
const findNotices = async (page_query, limit_query) => {
  try {
    let page = Math.max(1, page_query);
    let limit = Math.max(1, limit_query);
    page = !isNaN(page) ? page : 1;
    limit = !isNaN(limit) ? limit : 10;
    let offset = (page - 1) * limit;
    const query = `
      SELECT id, title, DATE_FORMAT(created_at,'%Y.%m.%d') AS created_at
      FROM Notice
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset};
    `;
    const data = await sequelize.query(query, { type: QueryTypes.SELECT });
    return data;
  } catch (error) {
    Logger.error(error);
  }
};

// * 공지 상세 조회
const noticeInfo = async (notice_id) => {
  try {
    const query = `
      SELECT title, content, DATE_FORMAT(created_at,'%Y.%m.%d') AS created_at
      FROM Notice
      WHERE id = ${notice_id};
    `;
    const update_query = `
      UPDATE Notice
      SET view_count = view_count + 1
      WHERE id = ${notice_id}
      `;
    await sequelize.query(update_query);
    const data = await sequelize.query(query, { type: QueryTypes.SELECT });
    return data[0];
  } catch (error) {
    Logger.error(error);
  }
};

export default { findNotices, noticeInfo };
