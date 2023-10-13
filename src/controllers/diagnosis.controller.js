import { statusCode, message, isSuccess } from "../utils/http.util.js";
import { DiagnosisService } from "../services/index.service.js";

// 진단 질문 생성
const createQuestion = async (req, res, next) => {
  try {
    const diagnosis_id = req.params.diagnosis_id;
    const { title } = req.body;

    if (!title) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(isSuccess.fail(statusCode.BAD_REQUEST, message.NOT_FOUND));
    }

    const diagnosisData = await DiagnosisService.createQuestion(
      title,
      parseInt(diagnosis_id)
    );

    if (diagnosisData.status === 200) {
      const { status, success, message, data } = diagnosisData;
      res.status(status).json({ status, success, message, data });
    } else {
      const { status, success, message } = diagnosisData;
      res.status(status).json({ status, success, message });
    }
  } catch (error) {
    next(error);
  }
};

//답변 생성
const createAnswer = async (req, res, next) => {
  try {
    const question_id = req.params.question_id;
    const { answer } = req.body;

    const match = answer.match(/\((\d+)점\)/);
    if (!answer || !match) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(isSuccess.fail(statusCode.BAD_REQUEST, "Invalid Value"));
    }

    const score = parseInt(match[1]);

    const diagnosisData = await DiagnosisService.createAnswer(
      answer,
      parseInt(question_id),
      score
    );

    if (diagnosisData.status === 200) {
      const { status, success, message, data } = diagnosisData;
      res.status(status).json({ status, success, message, data });
    } else {
      const { status, success, message } = diagnosisData;
      res.status(status).json({ status, success, message });
    }
  } catch (error) {
    next(error);
  }
};

//회원 진단
const createUserDiagnosis = async (req, res, next) => {
  try {
    const diagnosis_id = req.params.diagnosis_id;
    const { choose, result_score, standard_score } = req.body;
    // const user_id = req.user_id;

    const returnResponse = await DiagnosisService.createUserDiagnosis(
      parseInt(diagnosis_id),
      JSON.stringify(choose),
      result_score,
      standard_score
    );

    if (returnResponse) {
      res.status(statusCode.OK).json(returnResponse);
    } else {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(isSuccess.fail(statusCode.BAD_REQUEST, message.NOT_FOUND));
    }
  } catch (error) {
    next(error);
  }
};

// 진단 리스트 조회
const getDiagnosisList = async (req, res, next) => {
  try {
    const diagnosisListData = await DiagnosisService.getDiagnosisList();
    const simplifiedData = diagnosisListData.map((item) => {
      const { id, title, explain } = item;
      return { id, title, explain };
    });
    res
      .status(statusCode.OK)
      .json(
        isSuccess.success(
          statusCode.OK,
          message.READ_POST_SUCCESS,
          simplifiedData
        )
      );
  } catch (error) {
    next(error);
  }
};

//진단 상세조회
const getOneDiagnosisById = async (req, res, next) => {
  try {
    const diagnosis_id = req.params.diagnosis_id;

    const resultData = await DiagnosisService.getOneDiagnosisById(
      parseInt(diagnosis_id)
    );

    if (resultData.status !== 200) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(isSuccess.fail(statusCode.BAD_REQUEST, message.NOT_FOUND));
    }
    delete resultData.status;

    res
      .status(statusCode.OK)
      .json(
        isSuccess.success(statusCode.OK, message.READ_POST_SUCCESS, resultData)
      );
  } catch (error) {
    next(error);
  }
};
//최근 진단 내역 리스트
const getCurrentUserDiagnosisList = async (req, res, next) => {
  try {
    const user_id = req.user_id;
    const resultData = await DiagnosisService.getCurrentUserDiagnosisList(
      user_id
    );
    res.status(200).json(resultData);
  } catch (error) {
    next(error);
  }
};
//최근 진단 내역 카운트
const getCurrentUserDiagnosisListCount = async (req, res, next) => {
  try {
    const user_id = req.user_id;
    const resultData = await DiagnosisService.getCurrentUserDiagnosisListCount(
      user_id
    );
    res.status(200).json(resultData);
  } catch (error) {
    next(error);
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
