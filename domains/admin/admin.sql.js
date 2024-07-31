// 공지방 생성
export const createRoomsSQL = `
  INSERT INTO room (admin_id, room_image, admin_nickname, room_name, room_password, room_invite_url, max_penalty)
  VALUES (?, ?, ?, ?, ?, ?, ?) 
`;

// 공지방 수정
export const updateRoomsSQL = `
   UPDATE room SET admin_nickname = ?, room_name = ?, room_password = ?, room_image = ?, max_penalty = ?
   WHERE id = ?;
`;

// 공지방 삭제
export const deleteRoomsSQL = `
    UPDATE room SET updated_at = NOW(), state = 'deleted' WHERE id = ?;
`;

// 공지글 생성 & 공지방 이미지
export const createPostSQL = `
  INSERT INTO post (room_id, title, content, type, start_date, end_date, question, unread_count, user_id)
  VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);  
`;
export const getMemberCountSQL = `
  SELECT COUNT(*) AS user_count
  FROM \`user-room\` WHERE room_id = ?;
`;
export const createPostImgSQL = `
  INSERT INTO \`post-image\` (URL, post_id) VALUES(?,?);  
`;

// 공지글 수정 & 이미지 삭제
export const updatePostSQL = ` 
  UPDATE post
  SET title = ?, content = ?, start_date = ?, end_date = ?, question = ? 
  WHERE id = ?;  
`;
export const deletePostImgSQL = `
    UPDATE \`post-image\` SET state = 'DELETED' WHERE post_id = ? AND URL = ?;
`;

// 유저 프로필 조회
export const getProfileByUserId = `
  SELECT ur.nickname, ur.profile_image, ur.penalty_count
  FROM \`user-room\` ur
  JOIN user u ON u.id = ur.user_id
  WHERE u.id = ?
`;
