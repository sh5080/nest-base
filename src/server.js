import express from "express";
import routes from "./routers/index.router.js";
import Logger from "./configs/logger.config.js";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware.js";
const app = express();

import dotenv from "dotenv";
dotenv.config();

// * express setting
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * cors setting
// * 모든 출처 허용 옵션
app.use(cors({ origin: "*" }));

// * router index
app.use("/api/v1/", routes);

// error
app.use(errorHandler);

// env port import
import env from "./configs/env.config.js";
app.listen(env.port, async () => {
  Logger.info(`🌱 ID Server Listening On PORT: ${env.port} 🌱`);
});
