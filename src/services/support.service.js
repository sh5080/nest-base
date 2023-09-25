import 'dotenv/config';
import Logger from '../configs/logger.config.js';
import sequelize from '../configs/sequelize.config.js';
import { QueryTypes } from 'sequelize';

// * 서포트 리스트 조회
const supports = async (user_id, organization) => {
  try {
    const sql = `
      SELECT s.id, s.title, s.category, IF(us.user_id IS NULL, 0, 1) AS is_mark
      FROM Support s
      LEFT JOIN UserSupport us ON s.id = us.support_id AND us.user_id = ${user_id}
      WHERE s.organization = '${organization}'
    `;
    const data = await sequelize.query(sql, { type: QueryTypes.SELECT });
    return data;
  } catch (error) {
    Logger.error(error);
  }
};

// * 서포트 상세 조회
const findBySupportId = async (user_id, support_id) => {
  try {
    const sql = `
      SELECT s.id, s.title, content, IF(us.user_id IS NULL, 0, 1) AS is_mark, DATE_FORMAT(s.created_at, '%Y.%m.%d') AS created_at
      FROM Support s
      LEFT JOIN UserSupport us ON s.id = us.support_id AND us.user_id = ${user_id}
      WHERE s.id = ${support_id}
    `;
    const data = await sequelize.query(sql, { type: QueryTypes.SELECT });
    return data[0];
  } catch (error) {
    Logger.error(error);
  }
};

// * 회원 서포트 북마크
const bookmarkSupport = async (user_id, support_id) => {
  const findQuery = `
    SELECT id
    FROM UserSupport
    WHERE user_id = ${user_id} AND support_id = ${support_id}
  `;
  const bookmark = await sequelize.query(findQuery, {
    type: QueryTypes.SELECT,
  });
  if (0 < bookmark.length) {
    const query = `
      DELETE FROM UserSupport
      WHERE user_id = ${user_id} AND support_id = ${support_id}
    `;
    await sequelize.query(query);
  } else {
    const query = `
      INSERT INTO UserSupport(user_id, support_id)
      VALUES (${user_id}, ${support_id})
    `;
    await sequelize.query(query);
  }
};

// * 회원이 북마크한 보조금24 조회
const userBookmarkSupport = async (user_id) => {
  const query = `
    SELECT s.id, s.title, s.category, IF(us.user_id IS NULL, 0, 1) AS is_mark
    FROM Support s
    LEFT JOIN UserSupport us ON s.id = us.support_id
    WHERE us.user_id = ${user_id}
  `;
  const data = await sequelize.query(query, { type: QueryTypes.SELECT });
  return data;
};

export default {
  supports,
  findBySupportId,
  bookmarkSupport,
  userBookmarkSupport,
};
