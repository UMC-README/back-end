// 회원가입
export const userSignUpSQL = `
    INSERT INTO User (name, nickname, email, password) VALUES (?, ?, ?, ?)
`;
