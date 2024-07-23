import jwt from "jsonwebtoken";

export const generateJWTToken = (userId) => {
  return jwt.sign({ userId: userId, provider: "README" }, process.env.JWT_SECRET_KEY, {
    expiresIn: "3h",
  });
};
