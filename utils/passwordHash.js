import crypto from "crypto";

export const passwordHashing = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};
