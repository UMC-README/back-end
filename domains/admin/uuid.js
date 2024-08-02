import { v4 } from "uuid";
export const createShortUUID = () => {
  const tokens = v4().split("-");
  return tokens[2] + tokens[1];
};
