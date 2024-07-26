// 공지방 생성
export const createRoomsByUser = ` 
  SELECT r.admin_nickname, r.room_name, r.room_password, r.max_penalty
  FROM room r
  JOIN user u ON u.id = r.user_id
  WHERE u.id = ? AND r.status = 'EXIST'   
`;

// 유저 프로필 조회
export const getProfileByUserId = `
  SELECT ur.nickname, ur.profile_image, ur.penalty_count
  FROM \`user-room\` ur
  JOIN user u ON u.id = ur.user_id
  WHERE u.id = ?
`;
