import { Router } from "express";
import { DiagnosisController } from "../controllers/index.controller.js";
import authCheck from "../middlewares/auth.middleware.js";
const router = Router();

//자가진단 질문 생성
router
  .route("/question/:diagnosis_id")
  .post(DiagnosisController.createQuestion);

//자가진단 답변 생성
router.route("/answer/:question_id").post(DiagnosisController.createAnswer);

//회원진단 저장
router
  .route("/user/:diagnosis_id")
  .post(authCheck, DiagnosisController.createUserDiagnosis);

//자가진단 리스트
router.route("/").get(DiagnosisController.getDiagnosisList);

//자가진단 상세조회
router.route("/:diagnosis_id").get(DiagnosisController.getOneDiagnosisById);

//최근 진단 내역 리스트
router
  .route("/user/list")
  .get(authCheck, DiagnosisController.getCurrentUserDiagnosisList);

//최근 진단내역 카운트
router
  .route("/user/count")
  .get(authCheck, DiagnosisController.getCurrentUserDiagnosisListCount);

export default router;
