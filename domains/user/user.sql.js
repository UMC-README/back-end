// 회원가입
export const userSignUpSQL = `
    INSERT INTO User (name, nickname, email, password) VALUES (?, ?, ?, ?)
`;

// ID 값으로 User 찾기
export const getUserById = `
  SELECT * FROM User WHERE id = ?
`;

// 이메일로 User 찾기
export const getUserByEmail = `
  SELECT * FROM User WHERE email = ?
`;
