// 공지방 생성
export const createRoomsSQL = `
  INSERT INTO room (admin_id, room_image, admin_nickname, room_name, room_password, room_invite_url, max_penalty)
  VALUES (?, ?, ?, ?, ?, ?, ?) 
`;

export const userRoomSQL = `
  INSERT INTO \`user-room\` (user_id, room_id, nickname)
  VALUES (?, ?, ?);
`;

// 공지방 수정
export const updateRoomsSQL = `
   UPDATE room SET admin_nickname = ?, room_name = ?, room_password = ?, room_image = ?, max_penalty = ?
   WHERE id = ?;
`;

// 공지방 삭제
export const deleteRoomsSQL = `
    UPDATE room SET updated_at = NOW(), state = 'DELETED' WHERE id = ?;
`;

// 공지글 생성 & 공지방 이미지
export const createPostSQL = `
  INSERT INTO post (room_id, type, title, content, start_date, end_date, question, quiz_answer, unread_count, user_id)
  VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);  
`;
export const getMemberCountSQL = `
  SELECT COUNT(*) AS user_count
  FROM \`user-room\` WHERE room_id = ?;
`;

export const quizAnswerSQL = `
  UPDATE post set quiz_answer = ? WHERE id = ?;
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

// 공지글 삭제
export const deletePostSQL = `
    UPDATE post SET updated_at = NOW(), state = 'deleted' WHERE id = ?;
`;

// 미확인 유저 조회 
export const unreadUserListSQL = ` 
SELECT ur.profile_image, ur.nickname
FROM \`user-room\` ur
JOIN post p ON p.room_id = ur.room_id AND p.id = ?
WHERE ur.user_id NOT IN
      (SELECT s.user_id FROM submit s WHERE s.submit_state = 'COMPLETE' AND s.post_id = p.id);
`;

// 유저 검색
export const userListNameSQL = ` 
  SELECT nickname, profile_image FROM \`user-room\` WHERE nickname = ? AND room_id = ?; 
`; 
export const userListSQL = ` 
  SELECT nickname, profile_image FROM \`user-room\` WHERE room_id = ?;
`; 


// 유저 프로필 조회
export const userProfileSQL = `
  SELECT ur.nickname, ur.profile_image, ur.penalty_count
  FROM \`user-room\` ur
  JOIN user u ON u.id = ur.user_id
  JOIN room r ON r.id = ur.room_id
  WHERE r.id = ? AND u.id = ? 
`;

// 유저 초대하기 (=공지방 조회)
export const userInviteSQL = `
  SELECT r.room_image, r.room_invite_url, r.room_name, r.room_password, r.admin_nickname
  FROM room r
  WHERE r.id = ?; 
`;

// 유저 강퇴하기
export const checkUserInRoomSQL = `
  select * from \`user-room\` where nickname = ? AND room_id = ?
`;

export const deleteUserSQL = ` 
  DELETE FROM  \`user-room\` WHERE nickname = ? AND room_id;
`;
