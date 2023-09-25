import 'dotenv/config';
import Logger from '../configs/logger.config.js';
import sequelize from '../configs/sequelize.config.js';
import { QueryTypes } from 'sequelize';

// * 오늘의 감정 등록
const recordEmotion = async (user_id, level) => {
  try {
    const query = `
      INSERT INTO UserEmotion (user_id, level)
      VALUES (${user_id}, ${level})
    `;
    await sequelize.query(query);
  } catch (error) {
    Logger.error(error);
  }
};

// * 감정컬러 리스트
const userEmotions = async (user_id, created_month) => {
  try {
    const query = `
      SELECT ue.id, level, DATE_FORMAT(ue.created_at, '%Y-%m-%d') AS created_at
      FROM UserEmotion ue
      WHERE ue.user_id = ${user_id} AND DATE_FORMAT(ue.created_at, '%Y-%m') = '${created_month}'
      ORDER BY ue.created_at ASC
    `;
    const data = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return data;
  } catch (error) {
    Logger.error(error);
  }
};

// * 감정기록 삭제
const deleteEmotion = async (_emotion_id) => {
  try {
    const query = `
    DELETE FROM UserEmotion
    WHERE id = ${_emotion_id}
   `;
    await sequelize.query(query);
  } catch (error) {
    Logger.error(error);
  }
};

export default { recordEmotion, userEmotions, deleteEmotion };
