import "dotenv/config";
import Logger from "../configs/logger.config.js";
import sequelize from "../configs/sequelize.config.js";
import { QueryTypes } from "sequelize";
import {
  AppError,
  isSuccess,
  message,
  statusCode,
} from "../utils/http.util.js";

// * 메모 등록
const createMemo = async (user_id, memo, record_date, record_time) => {
  try {
    const query = `
          INSERT INTO UserMemo (user_id, memo, record_date, record_time)
          VALUES (:user_id, :memo, :record_date, :record_time)
        `;
    await sequelize.query(query, {
      replacements: { user_id, memo, record_date, record_time },
      type: QueryTypes.INSERT,
    });
  } catch (error) {
    Logger.error(error);
    throw error;
  }
};

// * 전체 메모 조회
const getMemo = async (user_id) => {
  try {
    const query = `
      SELECT um.id, memo, record_date, record_time
      FROM UserMemo um
      WHERE um.user_id = :user_id
    `;
    const resultData = await sequelize.query(query, {
      replacements: { user_id: user_id },
      type: QueryTypes.SELECT,
    });

    if (resultData.length === 0) {
      throw new AppError(
        statusCode.NOT_FOUND,
        message.NOT_FOUND,
        "검색결과가 없습니다."
      );
    }
    return resultData;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
};

// * 특정 메모 조회
const getOneMemo = async (user_id, id) => {
  try {
    const query = `
      SELECT um.id, memo, record_date, record_time
      FROM UserMemo um
      WHERE um.user_id = :user_id AND um.id = :id
    `;
    const resultData = await sequelize.query(query, {
      replacements: { user_id: user_id, id: id },
      type: QueryTypes.SELECT,
    });

    if (resultData.length === 0) {
      throw new AppError(
        statusCode.NOT_FOUND,
        message.NOT_FOUND,
        "검색결과가 없습니다."
      );
    }
    return resultData;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
};

// * 메모 수정
const updateMemo = async (user_id, id, newMemo) => {
  try {
    const checkQuery = `
      SELECT id
      FROM UserMemo
      WHERE id = :id AND user_id = :user_id
    `;
    const checkResult = await sequelize.query(checkQuery, {
      replacements: { id: id, user_id: user_id },
      type: QueryTypes.SELECT,
    });

    if (checkResult.length === 0) {
      throw new AppError(
        statusCode.NOT_FOUND,
        message.NOT_FOUND,
        "Memo not found for user."
      );
      return { status: "error", message: "Memo not found for user" };
    }

    const updateQuery = `
      UPDATE UserMemo
      SET memo = :newMemo
      WHERE id = :id AND user_id = :user_id
    `;

    await sequelize.query(updateQuery, {
      replacements: { id: id, user_id: user_id, newMemo: newMemo },
      type: QueryTypes.UPDATE,
    });

    return { status: "success", message: "Memo updated successfully" };
  } catch (error) {
    Logger.error(error);
    throw error;
  }
};
const deleteMemo = async (user_id, id) => {
  try {
    const ownershipQuery = `
      SELECT id
      FROM UserMemo
      WHERE user_id = :user_id AND id = :id
    `;
    const ownershipCheck = await sequelize.query(ownershipQuery, {
      replacements: { user_id, id },
      type: QueryTypes.SELECT,
    });

    if (ownershipCheck.length === 0) {
      throw new AppError(
        statusCode.NOT_FOUND,
        message.NOT_FOUND,
        "permission error."
      );
    }

    const deleteQuery = `
      DELETE FROM UserMemo
      WHERE id = :id
    `;
    await sequelize.query(deleteQuery, {
      replacements: { id },
      type: QueryTypes.DELETE,
    });
  } catch (error) {
    Logger.error(error);
    throw error;
  }
};

export default { createMemo, getMemo, getOneMemo, updateMemo, deleteMemo };
