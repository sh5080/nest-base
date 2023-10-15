import { Router } from "express";
import { MemoController } from "../controllers/index.controller.js";
import authCheck from "../middlewares/auth.middleware.js";
const router = Router();

//메모 생성
router.route("/record").post(
  // authCheck,
  MemoController.createMemo
);

//전체 메모 조회
router.route("/").get(
  // authCheck,
  MemoController.getMemo
);

//특정 메모 조회
router.route("/:id").get(
  // authCheck,
  MemoController.getOneMemo
);

//메모 수정
router.route("/:id").put(
  // authCheck,
  MemoController.updateMemo
);

// 메모 삭제
router.route("/:id").delete(
  // authCheck,
  MemoController.deleteMemo
);

export default router;
