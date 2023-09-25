import jwt from 'jsonwebtoken';
import sequelize from '../configs/sequelize.config.js';
import { QueryTypes } from 'sequelize';
import env from '../configs/env.config.js';

const tokenPublish = async (id, uuid) => {
  try {
    const findQuery = `SELECT auth_token FROM UserToken WHERE user_id = ${id}`;
    const user = await sequelize.query(findQuery, { type: QueryTypes.SELECT });
    if (user.length == 0) {
      // * userToken == false
      const auth_token = jwt.sign({ id: id, uuid: uuid }, env.jwtSecretKey, {
        algorithm: 'HS256',
        expiresIn: env.jwtRefreshOption.expiresIn,
        issuer: env.jwtRefreshOption.issuer,
      });
      const insertQuery = `
        INSERT INTO UserToken(auth_token, user_id)
        VALUES ('${auth_token}', ${id})
      `;
      await sequelize.query(insertQuery);
      return auth_token;
    } else {
      // * userToken == true
      const auth_token = user[0]['auth_token'];
      return auth_token;
    }
  } catch (error) {
    if (error.message === 'jwt expired') {
      const auth_token = jwt.sign({ id: id, uuid: uuid }, env.jwtSecretKey, {
        algorithm: 'HS256',
        expiresIn: env.jwtRefreshOption.expiresIn,
        issuer: env.jwtRefreshOption.issuer,
      });
      const updateQuery = `
        UPDATE UserToken
        SET auth_token='${auth_token}'
        WHERE user_id=${id}
      `;
      await sequelize.query(updateQuery);
      return auth_token;
    }
    throw new Error(error.message);
  }
};

export default tokenPublish;
