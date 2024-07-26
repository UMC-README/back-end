// 회원가입
export const userSignUpSQL = `
    INSERT INTO user (name, nickname, email, password) VALUES (?, ?, ?, ?)
`;

// ID 값으로 User 찾기
export const getUserById = `
  SELECT * FROM user WHERE id = ?
`;

// 이메일로 User 찾기
export const getUserByEmail = `
  SELECT * FROM user WHERE email = ?
`;

// 고정된 공지 찾기
export const getFixedPost = `
  SELECT p.*
  FROM user u
  JOIN post p ON u.fixed_post_id = p.id
  WHERE u.id = ?
`;

// 개설한 공지방 찾기
export const getCreateRoom = `
  SELECT r.*
  FROM user u
  JOIN room r ON u.id = r.admin_id
  WHERE u.id = ?
`;
