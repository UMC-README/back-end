import path from "path";
import YAML from "yamljs";
import { cwd } from "process";
import dotenv from "dotenv";

dotenv.config();

const userSwagger = YAML.load(path.join(cwd(), "/swagger/user.swagger.yaml"));
const roomSwagger = YAML.load(path.join(cwd(), "/swagger/room.swagger.yaml"));
const adminSwagger = YAML.load(path.join(cwd(), "/swagger/admin.swagger.yaml"));

export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "README Swagger",
    version: "1.0.0",
    description: "READ.ME API 입니다.",
  },
  servers: [
    {
      url: process.env.PRODUCTION_SERVER_URL,
      description: "prod",
    },
    {
      url: process.env.DEVELOPMENT_SERVER_URL,
      description: "dev",
    },
  ],
  paths: {
    ...userSwagger.paths,
    ...roomSwagger.paths,
    ...adminSwagger.paths,
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
      ...adminSwagger.components?.schemas,
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};
