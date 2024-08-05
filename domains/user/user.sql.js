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

export const updateUserProfile = `
  UPDATE user
  SET name = ?, nickname = ?, profile_image = ?
  WHERE id = ?
`;

export const updateUserRoomProfile = `
  UPDATE \`user-room\`
  SET nickname = ?, profile_image = ?
  WHERE user_id = ? AND room_id = ?
`;

export const updateUserPassword = `
  UPDATE user
  SET password = ?
  WHERE id = ?
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
  SELECT ur.nickname, ur.profile_image, r.room_name
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
  SELECT room.id, room.admin_nickname, room.room_name, room.room_image, room.state, MAX(post.created_at) as latest_post_time
  FROM room
  LEFT JOIN post ON room.id = post.room_id
  WHERE room.admin_id = ?
  GROUP BY room.id
  LIMIT ?
  OFFSET ?
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
  SELECT room.id, room.admin_nickname, room.room_name, room.room_image, room.state, MAX(post.created_at) as latest_post_time
  FROM room
  JOIN \`user-room\` ON room.id = \`user-room\`.room_id
  LEFT JOIN post ON room.id = post.room_id
  WHERE \`user-room\`.user_id = ?
  GROUP BY room.id
  LIMIT ?
  OFFSET ?
`;
