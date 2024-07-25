import path from "path";
import YAML from "yamljs";
import { cwd } from "process";

const userSwagger = YAML.load(path.join(cwd(), "/swagger/user.swagger.yaml"));

export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "README Swagger",
    version: "1.0.0",
    description: "READ.ME API 입니다.",
  },
  servers: [
    {
      url: "http://localhost:8000",
      description: "Development server",
    },
  ],
  paths: {
    ...userSwagger.paths,
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
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};
