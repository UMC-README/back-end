import SwaggerUi from "swagger-ui-express";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { swaggerSpec } from "./swagger/swagger.config.js";
import { status } from "./config/response.status.js";
import { response } from "./config/response.js";

dotenv.config();

const app = express();

app.set("port", process.env.PORT || 8000); // 서버 포트 지정

app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use(cors()); // cors 방식 허용

app.use("/api-docs", SwaggerUi.serve, SwaggerUi.setup(swaggerSpec));

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.data.status || status.INTERNAL_SERVER_ERROR).send(response(err.data));
});

app.listen(app.get("port"), () => {
  console.log(`Example app listening on port ${app.get("port")}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
