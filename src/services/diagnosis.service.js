import "dotenv/config";
import Logger from "../configs/logger.config.js";
import sequelize from "../configs/sequelize.config.js";
import { statusCode, message, isSuccess } from "../utils/http.util.js";
import { QueryTypes } from "sequelize";

const createQuestion = async (title, diagnosis_id) => {
  try {
    const returnResponse = {
      status: statusCode.OK,
      success: true,
      message: message.READ_POST_SUCCESS,
    };

    const validDiagnosisIds = await sequelize.query(
      "SELECT id FROM SelfDiagnosis",
      {
        type: QueryTypes.SELECT,
      }
    );
    const validDiagnosisIdValues = validDiagnosisIds.map((row) => row.id);

    if (!validDiagnosisIdValues.includes(diagnosis_id)) {
      returnResponse.status = 401;
      returnResponse.success = false;
      returnResponse.message = "diagnosis_id is not found";
      return returnResponse;
    }

    const duplicateTitles = await sequelize.query(
      `SELECT title FROM SelfDiagnosisQuestion WHERE title = :title AND diagnosis_id = :diagnosis_id`,
      {
        replacements: { title: title, diagnosis_id: diagnosis_id },
        type: QueryTypes.SELECT,
      }
    );

    if (duplicateTitles.length > 0 && duplicateTitles[0].title === title) {
      returnResponse.status = 401;
      returnResponse.success = false;
      returnResponse.message = "title already exist";
      return returnResponse;
    }
    const maxSortForDiagnosis = await sequelize.query(
      "SELECT MAX(sort) FROM SelfDiagnosisQuestion WHERE diagnosis_id = :diagnosis_id",
      {
        replacements: { diagnosis_id: diagnosis_id },
        type: QueryTypes.SELECT,
      }
    );

    const maxSort = maxSortForDiagnosis[0]["MAX(sort)"];

    const sort = maxSort !== null ? maxSort + 1 : 1;

    const [diagnosisListData] = await sequelize.query(
      "INSERT INTO SelfDiagnosisQuestion (title, diagnosis_id, sort) VALUES (:title, :diagnosis_id, :sort)",
      {
        replacements: { title: title, diagnosis_id: diagnosis_id, sort: sort },
        type: QueryTypes.INSERT,
      }
    );
    if (returnResponse.status === 200) {
      returnResponse.data = { title, diagnosis_id, sort };
    }
    return returnResponse;
  } catch (error) {
    Logger.error(error);
    console.error(error);
  }
};

const createAnswer = async (answer, question_id, score) => {
  try {
    const returnResponse = {
      status: statusCode.OK,
      success: true,
      message: message.READ_POST_SUCCESS,
    };

    const questionData = await sequelize.query(
      "SELECT id FROM SelfDiagnosisQuestion WHERE id = :question_id",
      {
        replacements: { question_id: question_id },
        type: QueryTypes.SELECT,
      }
    );

    if (questionData.length === 0) {
      (returnResponse.status = statusCode.BAD_REQUEST),
        (returnResponse.success = false),
        (returnResponse.message = message.NULL_VALUE);

      return returnResponse;
    }

    const [answerData] = await sequelize.query(
      "INSERT INTO SelfDiagnosisAnswer (title, question_id, score) VALUES (:answer, :question_id, :score)",
      {
        replacements: {
          answer: answer,
          question_id: question_id,
          score: score,
        },
        type: QueryTypes.INSERT,
      }
    );

    if (returnResponse.status === 200) {
      returnResponse.data = { answer, question_id, score };
    }
    return returnResponse;
  } catch (error) {
    Logger.error(error);
    console.error(error);
  }
};

//회원 진단
const createUserDiagnosis = async (
  id,
  choose,
  result_score,
  standard_score
) => {
  try {
    const returnResponse = {
      status: statusCode.OK,
      success: true,
      message: message.READ_POST_SUCCESS,
    };

    // 검색할 질문의 ID를 조회
    // const questionIdQuery = `
    //     SELECT id
    //     FROM SelfDiagnosisQuestion
    //     WHERE title = :title;
    //   `;
    // const [questionIdResult] = await sequelize.query(questionIdQuery, {
    //   replacements: { title: title },
    //   type: QueryTypes.SELECT,
    // });

    // if (!questionIdResult) {
    //   (returnResponse.status = statusCode.BAD_REQUEST),
    //     (returnResponse.success = false),
    //     (returnResponse.message = message.NULL_VALUE);

    //   return returnResponse;
    // }

    // 답변을 생성
    const answerInsertQuery = `
    INSERT INTO UserDiagnosisResult (choose, result_score, user_id, diagnosis_id, standard_score)
    VALUES ( :choose, :result_score, :user_id, :diagnosis_id, :standard_score);
  `;
    const [answerInsertResult] = await sequelize.query(answerInsertQuery, {
      replacements: {
        choose,
        result_score,
        user_id: 251,
        diagnosis_id: id,
        standard_score,
      },
      type: QueryTypes.INSERT,
    });

    if (answerInsertResult) {
      return returnResponse;
    } else {
      (returnResponse.status = statusCode.BAD_REQUEST),
        (returnResponse.success = false),
        (returnResponse.message = message.NULL_VALUE);

      return returnResponse;
    }
  } catch (error) {
    Logger.error(error);
    if (error.name === "SequelizeForeignKeyConstraintError") {
      throw new Error("data mismatch");
    }
    console.error(error);
  }
};

//모든 진단리스트
const getDiagnosisList = async () => {
  try {
    const query = `
        SELECT * FROM SelfDiagnosis
      `;
    const diagnosisListData = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return diagnosisListData;
  } catch (error) {
    Logger.error(error);
    console.error(error);
  }
};

// 진단 상세조회
const getOneDiagnosisById = async (id) => {
  try {
    const returnResponse = {
      status: statusCode.OK,
      success: true,
      message: message.READ_POST_SUCCESS,
    };
    const diagnosisQuery = `
    SELECT id, title, sub_explain_01, sub_explain_02, result_explain_01, result_explain_02
    FROM SelfDiagnosis
    WHERE id = :id
  `;
    const diagnosisData = await sequelize.query(diagnosisQuery, {
      replacements: { id },
      type: QueryTypes.SELECT,
    });

    if (diagnosisData.length === 0) {
      (returnResponse.status = statusCode.BAD_REQUEST),
        (returnResponse.success = false),
        (returnResponse.message = message.NULL_VALUE);

      return returnResponse;
    }
    const answersQuery = `
    SELECT
      sdq.sort as sort,
      sdq.title as question_title,
      sda.score as score,
      sda.title as answer_title
    FROM SelfDiagnosisQuestion sdq
    JOIN SelfDiagnosisAnswer sda ON sdq.id = sda.question_id
    WHERE sdq.diagnosis_id = :id
  `;
    const answersData = await sequelize.query(answersQuery, {
      replacements: { id },
      type: QueryTypes.SELECT,
    });

    const structuredData = {
      id: diagnosisData[0].id,
      title: diagnosisData[0].title,
      sub_explain_01: diagnosisData[0].sub_explain_01,
      sub_explain_02: diagnosisData[0].sub_explain_02,
      result_explain_01: diagnosisData[0].result_explain_01,
      result_explain_02: diagnosisData[0].result_explain_02,
      answers: answersData.reduce((acc, answer) => {
        const existingAnswer = acc.find(
          (item) =>
            item.sort === answer.sort && item.title === answer.question_title
        );

        if (existingAnswer) {
          existingAnswer.answer.push({
            score: answer.score,
            answer: answer.answer_title,
          });
        } else {
          acc.push({
            sort: answer.sort,
            title: answer.question_title,
            answer: [
              {
                score: answer.score,
                answer: answer.answer_title,
              },
            ],
          });
        }

        return acc;
      }, []),
    };
    if (structuredData) {
      structuredData.status = 200;
    }
    return structuredData;
  } catch (error) {
    Logger.error(error);
    console.error(error);
  }
};
const getCurrentUserDiagnosisList = async (user_id) => {
  try {
    const returnResponse = {
      status: statusCode.OK,
      success: true,
      message: message.READ_POST_SUCCESS,
      data: [],
    };

    const recentResults = await sequelize.query(
      "SELECT * FROM UserDiagnosisResult WHERE user_id = :user_id ORDER BY diagnosis_id ASC, created_at DESC",
      {
        replacements: { user_id: user_id },
        type: QueryTypes.SELECT,
      }
    );

    const uniqueDiagnosisIds = new Set();

    for (const result of recentResults) {
      const diagnosisId = result.diagnosis_id;

      // 이미 해당 diagnosis_id를 가져왔는지 확인
      if (!uniqueDiagnosisIds.has(diagnosisId)) {
        const [selfDiagnosisData] = await sequelize.query(
          "SELECT id, title FROM SelfDiagnosis WHERE id = :diagnosis_id",
          {
            replacements: { diagnosis_id: diagnosisId },
            type: QueryTypes.SELECT,
          }
        );

        returnResponse.data.push({
          id: selfDiagnosisData.id,
          title: selfDiagnosisData.title,
          result_score: result.result_score,
          created_at: result.created_at,
        });

        // 해당 diagnosis_id를 Set에 추가하여 중복 방지
        uniqueDiagnosisIds.add(diagnosisId);
      }
    }
    if (!recentResults) {
      (returnResponse.status = statusCode.BAD_REQUEST),
        (returnResponse.success = false),
        (returnResponse.message = message.NULL_VALUE);
    }

    return returnResponse;
  } catch (error) {
    Logger.error(error);
    console.error(error);
  }
};

const getCurrentUserDiagnosisListCount = async (user_id) => {
  try {
    const returnResponse = {
      status: statusCode.OK,
      success: true,
      message: message.READ_POST_SUCCESS,
      data: [],
    };
    const [diagnosisCounts] = await sequelize.query(
      `
        SELECT COUNT(DISTINCT diagnosis_id) as diagnosis_count
        FROM UserDiagnosisResult
        WHERE user_id = :user_id
        GROUP BY user_id;
        `,
      {
        replacements: { user_id: user_id },
        type: QueryTypes.SELECT,
      }
    );

    if (diagnosisCounts) {
      returnResponse.data = { count: diagnosisCounts.diagnosis_count };
    } else {
      returnResponse.data = { count: 0 };
    }
    return returnResponse;
  } catch (error) {
    Logger.error(error);
    console.error(error);
  }
};

export default {
  createQuestion,
  createAnswer,
  createUserDiagnosis,
  getDiagnosisList,
  getOneDiagnosisById,
  getCurrentUserDiagnosisList,
  getCurrentUserDiagnosisListCount,
};
