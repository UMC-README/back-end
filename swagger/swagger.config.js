import path from "path";
import YAML from "yamljs";
import { cwd } from "process";
import dotenv from "dotenv";

dotenv.config();
process.env.NODE_ENV =
  process.env.NODE_ENV && process.env.NODE_ENV.trim().toLowerCase() === "production"
    ? "production"
    : "development";
const isDevMode = process.env.NODE_ENV === "development";

const userSwagger = YAML.load(path.join(cwd(), "/swagger/user.swagger.yaml"));
const roomSwagger = YAML.load(path.join(cwd(), "/swagger/room.swagger.yaml"));

export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "README Swagger",
    version: "1.0.0",
    description: "READ.ME API 입니다.",
  },
  servers: [
    {
      url: isDevMode ? process.env.DEVELOPMENT_SERVER_URL : process.env.PRODUCTION_SERVER_URL,
    },
  ],
  paths: {
    ...userSwagger.paths,
    ...roomSwagger.paths,
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ...userSwagger.components?.schemas,
      ...roomSwagger.components?.schemas,
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};
