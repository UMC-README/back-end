// 개설한 공지방 찾기
export const getProfileByUserId = `
  SELECT ur.nickname, ur.profile_image, ur.penalty_count
  FROM \`user-room\` ur
  JOIN user u ON u.id = ur.user_id
  WHERE u.id = ?
`;

export const createRooms = ` 
  SELECT r.*
  FROM user u
  JOIN room r ON u.id = r.admin_id
  WHERE u.id = ?
`;
