// 도메인에 맞는 swagger 파일을 불러와서 사용할 수 있도록 설정
// ex) const missionSwagger = YAML.load(path.join(cwd(), "/swagger/mission.swagger.yaml"));

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "README Swagger",
    version: "1.0.0",
  },
  paths: {
    // 사용하고자 하는 도메인의 yaml 파일 경로를 설정
    // ex) ...missionSwagger.paths,
  },
  components: {
    schemas: {
      // 사용하고자 하는 도메인의 yaml 파일의 components.schemas를 설정
      //   ex) ...missionSwagger.components?.schemas,
    },
  },
};
