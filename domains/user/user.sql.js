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

// 내 공지방 찾기
export const getRoom = `
  SELECT ur.*, r.room_name
  FROM \`user-room\` ur 
  JOIN user u ON u.id = ur.user_id
  JOIN room r ON r.id = ur.room_id
  WHERE u.id = ?
`;

// 개설한 공지방 개수 구하기
export const getCreateRoomCount = `
  SELECT COUNT(*) as count
  FROM user u
  JOIN room r ON u.id = r.admin_id
  WHERE u.id = ?
`;

// 개설한 공지방 찾기
export const getCreateRoom = `
  SELECT r.*
  FROM user u
  JOIN room r ON u.id = r.admin_id
  WHERE u.id = ?
  LIMIT ? OFFSET ?
`;

// 입장한 공지방 개수 구하기
export const getJoinRoomCount = `
  SELECT COUNT(*) as count
  FROM \`user-room\` ur
  JOIN user u ON u.id = ur.user_id
  JOIN room r ON r.id = ur.room_id
  WHERE u.id = ?
`;

// 입장한 공지방 찾기
export const getJoinRoom = `
  SELECT ur.nickname, r.room_name, r.room_image
  FROM \`user-room\` ur
  JOIN user u ON u.id = ur.user_id
  JOIN room r ON r.id = ur.room_id
  WHERE u.id = ?
  LIMIT ? OFFSET ?
`;
