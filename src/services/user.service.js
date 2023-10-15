import "dotenv/config";
import Logger from "../configs/logger.config.js";
import { statusCode, message } from "../utils/http.util.js";
import tokenPublish from "../utils/auth.util.js";
import { QueryTypes } from "sequelize";
import sequelize from "../configs/sequelize.config.js";
import { v4 } from "uuid";

const returnResponse = {
  status: statusCode.OK,
  success: true,
  message: message.READ_POST_SUCCESS,
};

// * 회원 유무
const isUser = async (email) => {
  try {
    const query = `
      SELECT email, auth_type, uuid, DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at
      FROM User
      WHERE email = '${email}'
    `;
    const user = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    if (user.length == 0) {
      returnResponse.status = 401;
      returnResponse.success = false;
      returnResponse.message = "User signup possible";
      return returnResponse;
    } else {
      returnResponse.status = 200;
      returnResponse.success = true;
      returnResponse.message = "User already exist";
      returnResponse.data = {
        email: user[0]["email"],
        auth_type: user[0]["auth_type"],
        created_at: user[0]["created_at"],
        uuid: user[0]["uuid"],
      };
      return returnResponse;
    }
  } catch (error) {
    Logger.error(error);
  }
};

// * 닉네임 사용 체트
const isNickName = async (nickname) => {
  try {
    const query = `
      SELECT nickname
      FROM User
      WHERE nickname = '${nickname}'
    `;
    const user = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    if (user.length == 0) {
      returnResponse.status = 200;
      returnResponse.success = true;
      returnResponse.message = `This <${nickname}> is available.`;
      return returnResponse;
    } else {
      returnResponse.status = 401;
      returnResponse.success = false;
      returnResponse.message = `This <${nickname}> is in use`;
      return returnResponse;
    }
  } catch (error) {
    Logger.error(error);
  }
};

// * 회원가입 kakao, google, apple
const signUp = async (
  nickname,
  email,
  year,
  birthday,
  auth_type,
  due_date,
  form,
  weight,
  height,
  is_pregnant,
  terms
) => {
  try {
    const uuid = () => {
      const uuidToken = v4().split("-");
      // DB 인덱싱 순서 보장 체계를 위한 인덱싱 수정
      // 1-2-3-4-5의 구조를 32145로 변경
      return (
        uuidToken[2] + uuidToken[1] + uuidToken[0] + uuidToken[3] + uuidToken[4]
      );
    };
    try {
      const iYear = !year ? `NULL` : `'${year}'`;
      const iBirthday = !birthday ? `NULL` : `'${birthday}'`;
      const iDueDate = !due_date ? `NULL` : `'${due_date}'`;
      const iForm = !form ? `NULL` : `'${form}'`;
      const userQuery = `
        INSERT INTO User(uuid, nickname, email, year, birthday, auth_type, weight, height, due_date, is_pregnant, form)
        VALUES ('${uuid()}', '${nickname}', '${email}', ${iYear}, ${iBirthday}, '${auth_type}', ${weight}, ${height},
        ${iDueDate}, ${is_pregnant}, ${iForm}
        )
        RETURNING id, uuid
      `;
      const user = await sequelize.query(userQuery, {
        type: QueryTypes.SELECT,
      });
      const auth_token = await tokenPublish(user[0]["id"], uuid());
      for (const element of terms) {
        const term = `
          INSERT INTO TermAgree(is_agree, user_id, term_id)
          VALUES (${element["is_agree"]}, ${user[0]["id"]}, ${element["id"]})
        `;
        await sequelize.query(term);
      }
      returnResponse.status = 201;
      returnResponse.success = true;
      returnResponse.message = "Signup success";
      returnResponse.data = {
        auth_token: auth_token,
        uuid: user[0]["uuid"],
      };
      return returnResponse;
    } catch (error) {
      Logger.error(error);
      if (error.name === "SequelizeUniqueConstraintError") {
        returnResponse.status = statusCode.BAD_REQUEST;
        returnResponse.success = false;
        returnResponse.message = message.UNIQUE_CONSTRAINT_ERROR;
        return returnResponse;
      }
    }
  } catch (error) {
    Logger.error(error);
    returnResponse.status = 400;
    returnResponse.success = false;
    returnResponse.message = error.name;
    return returnResponse;
  }
};

// * 로그인
const signIn = async (uuid, email) => {
  try {
    const query = `
      SELECT id, uuid
      FROM User
      WHERE uuid = '${uuid}' AND email = '${email}'
    `;
    const user = await sequelize.query(query, { type: QueryTypes.SELECT });
    // const signIn = async (uuid, email) => {
    //   try {
    //     const query = `
    //       SELECT id, uuid
    //       FROM User
    //       WHERE uuid = :uuid AND email = :email
    //     `;
    // const user = await sequelize.query(query, {
    //   replacements: { uuid, email },
    //   type: QueryTypes.SELECT,
    // });
    if (user.length == 0) {
      returnResponse.status = 400;
      returnResponse.success = false;
      returnResponse.message = "User not found";
      return returnResponse;
    } else {
      const auth_token = await tokenPublish(user[0]["id"], user[0]["uuid"]);
      const logQuery = `
        INSERT INTO UserLoginLog(user_id)
        VALUES (${user[0]["id"]})
      `;
      await sequelize.query(logQuery);
      returnResponse.status = 200;
      returnResponse.success = true;
      returnResponse.message = "Login success";
      returnResponse.data = { auth_token };
      return returnResponse;
    }
  } catch (error) {
    Logger.error(error);
  }
};

// * 회원 정보 수정
const updateUserInfo = async (user_id, updateDto) => {
  try {
    const keys = Object.keys(updateDto);
    for (let element = 0; element < keys.length; element++) {
      const key = keys[element];
      const typeOf = typeof updateDto[key];
      let value =
        typeOf === "boolean"
          ? `SET ${key} = ${updateDto[key]} WHERE id=${user_id};`
          : `SET ${key} = '${updateDto[key]}' WHERE id=${user_id};`;
      const query = `
        UPDATE User
      `;
      const updateQuery = query + value;
      await sequelize.query(updateQuery);
    }
  } catch (error) {
    Logger.error(error);
  }
};

// * 회원 프로필 이미지 수정
const updateProfileImage = async (user_id, image_url) => {
  try {
    const query = `
      UPDATE User
      SET profile_image_url = '${image_url}'
      WHERE id = ${user_id}
    `;
    await sequelize.query(query);
  } catch (error) {
    Logger.error(error);
  }
};

// * 회원 FCM TOKEN 업데이트
const updateFcmToken = async (user_id, fcm_token) => {
  try {
    const query = `
      UPDATE UserToken
      SET fcm_token = '${fcm_token}'
      WHERE user_id = ${user_id}
    `;
    await sequelize.query(query);
  } catch (error) {
    Logger.error(error);
  }
};

// * 회원 타입 조회
const userType = async (user_id) => {
  try {
    const query = `
      SELECT
        vu.uuid, vu.nickname,
        vu.year, vu.birthday
      FROM ViewUsers vu
      WHERE vu.id = ${user_id}
      ORDER BY ustr.created_at DESC
      LIMIT 1
    `;
    const data = await sequelize.query(query, { type: QueryTypes.SELECT });
    return data[0];
  } catch (error) {
    Logger.error(error);
  }
};

// * 회원 탈퇴
const userWithdrawal = async (user_id, reason) => {
  try {
    const withDrawalQuery = `
      INSERT INTO WithDrawal(reason)
      VALUES ('${reason}')
    `;
    await sequelize.query(withDrawalQuery);
    const query = `
      DELETE FROM User
      WHERE id = ${user_id}
    `;
    await sequelize.query(query);
  } catch (error) {
    Logger.error(error);
  }
};

export default {
  isUser,
  isNickName,
  signUp,
  signIn,
  updateUserInfo,
  updateProfileImage,
  userType,
  updateFcmToken,
  userWithdrawal,
};
