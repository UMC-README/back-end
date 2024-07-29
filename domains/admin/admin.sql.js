// 유저 아이디 불러오기
export const getUserByIdSQL = "SELECT user.id FROM user WHERE id = ?";

// 공지방 생성
export const createRoomsSQL = `
  INSERT INTO room (admin_id, admin_nickname, room_name, room_password, room_image, room_invite_url, max_penalty)
  VALUES (?, ?, ?, ?, ?, ?, ?) 
`;

// 공지방 수정
export const updateRoomsSQL = `
   UPDATE room SET admin_nickname = ?, room_name = ?, room_password = ?, room_image = ?, max_penalty = ?
   WHERE id = ?;
`;

// 유저 프로필 조회
export const getProfileByUserId = `
  SELECT ur.nickname, ur.profile_image, ur.penalty_count
  FROM \`user-room\` ur
  JOIN user u ON u.id = ur.user_id
  WHERE u.id = ?
`;
