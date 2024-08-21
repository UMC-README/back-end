import SwaggerUi from "swagger-ui-express";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { swaggerSpec } from "./swagger/swagger.config.js";
import { status } from "./config/response.status.js";
import { response } from "./config/response.js";
import { userRouter } from "./routes/user.route.js";
import { roomRouter } from "./routes/room.route.js";
import { adminRouter } from "./routes/admin.route.js";
import { reserveImposePenaltyForEveryValidPostDAO } from "./domains/admin/admin.dao.js";

dotenv.config();

const app = express();

app.set("port", process.env.PORT || 8000); // 서버 포트 지정

app.use(express.static("public")); // 정적 파일 접근
app.use(express.json({ limit: "50mb" })); // 요청 본문 크기를 50MB로 설정
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // 요청 본문 크기를 50MB로 설정
app.use(cors()); // cors 방식 허용

app.use("/api-docs", SwaggerUi.serve, SwaggerUi.setup(swaggerSpec));

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.data.status || status.INTERNAL_SERVER_ERROR).send(response(err.data));
});

app.listen(app.get("port"), () => {
  console.log(`Example app listening on port ${app.get("port")}`);
  // reserveImposePenaltyForEveryValidPostDAO();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
  console.log("Hello World!");
});

app.use("/user", userRouter);
app.use("/room", roomRouter);
app.use("/admin", adminRouter);
