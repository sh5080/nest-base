import 'dotenv/config';
import Logger from '../configs/logger.config.js';
import sequelize from '../configs/sequelize.config.js';
import { QueryTypes } from 'sequelize';

// * 약관 전체 조회
const terms = async () => {
  try {
    const query = `
      SELECT id, name, is_require, content
      FROM Term
    `;
    const term = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return term;
  } catch (error) {
    Logger.error(error);
  }
};

// * 약관 상세 조회
const findByTermId = async (term_id) => {
  try {
    const query = `
      SELECT id, name, is_require, content
      FROM Term
      WHERE id = ${term_id}
    `;
    const term = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return term[0];
  } catch (error) {
    Logger.error(error);
  }
};

// * 회원 약관 수정
const updateUserTerm = async (user_id, termUpdateDto) => {
  try {
    const query = `
        UPDATE TermAgree
        SET is_agree = ${termUpdateDto.is_agree}
        WHERE user_id = ${user_id} ANd term_id = ${termUpdateDto.id}
    `;
    await sequelize.query(query);
  } catch (error) {
    Logger.error(error);
  }
};

export default { terms, findByTermId, updateUserTerm };
