// 고정 공지글 변경
export const changeFixedPostSQL = `
  UPDATE user SET fixed_post_id = ? WHERE id = ?
`;

// ID 값으로 공지글 찾기
export const getPostById = `
  SELECT * FROM post WHERE id = ?
`;

// ID 값으로 공지방 찾기
export const getRoomById = `
  SELECT * FROM room WHERE id = ?
`;

//공지방 내 공지글 정보, 나의 제출상태 가져오기 (커서 존재)
export const getPostDetailsByRoomId = `
  SELECT p.id, p.type, p.title, p.content, pi.URL, p.start_date, p.end_date, p.comment_count, s.submit_state FROM post p
  JOIN user u ON p.room_id = ? AND u.id = ?
  LEFT JOIN submit s ON s.post_id = p.id AND s.user_id = u.id
  LEFT JOIN (
    SELECT pi.post_id, pi.URL
    FROM \`post-image\` pi
    JOIN (
      SELECT post_id, MIN(id) AS min_id
      FROM \`post-image\`
      GROUP BY post_id
    ) min_pi ON pi.id = min_pi.min_id
  ) pi ON pi.post_id = p.id
  WHERE p.state = 'EXIST' AND p.id < ?
  ORDER BY p.id DESC LIMIT ?
`;

//공지방 내 공지글 정보, 나의 제출상태 가져오기 (커서 없는 초기값)
export const getPostDetailsByRoomIdAtFirst = `
  SELECT p.id, p.type, p.title, p.content, pi.URL, p.start_date, p.end_date, p.comment_count, s.submit_state FROM post p
  JOIN user u ON p.room_id = ? AND u.id = ?
  LEFT JOIN submit s ON s.post_id = p.id AND s.user_id = u.id
  LEFT JOIN (
    SELECT pi.post_id, pi.URL
    FROM \`post-image\` pi
    JOIN (
      SELECT post_id, MIN(id) AS min_id
      FROM \`post-image\`
      GROUP BY post_id
    ) min_pi ON pi.id = min_pi.min_id
  ) pi ON pi.post_id = p.id
  WHERE p.state = 'EXIST'
  ORDER BY p.id DESC LIMIT ?
`;

//공지방 내 미확인 공지글 가져오기 (최신순 3개까지)
export const getMyNotCheckedPostInRoom = `
  SELECT p.id, r.room_name, p.title, TIMESTAMPDIFF(second, p.updated_at, CURRENT_TIMESTAMP) as updatedAtBeforeSec FROM post p
  JOIN user u ON p.room_id = ? AND u.id = ?
  JOIN room r ON r.id = p.room_id
  LEFT JOIN submit s ON s.post_id = p.id AND s.user_id = u.id
  WHERE p.state = 'EXIST' AND (s.submit_state IS NULL OR s.submit_state = 'NOT_COMPLETE' OR s.submit_state = 'REJECT')
  ORDER BY updatedAtBeforeSec ASC LIMIT 3
`;

//개별 공지글 정보 가져오기
export const getDetailedPostSQL = `
  SELECT p.id, p.type, p.title, p.content, p.start_date, p.end_date, p.comment_count, s.submit_state FROM post p
  JOIN user u ON u.id = ?
  LEFT JOIN submit s ON s.post_id = p.id AND s.user_id = u.id
  WHERE p.id = ? AND p.state = 'EXIST'
`;

//개별 공지글의 이미지 모두 가져오기
export const getPostImagesByPostId = `
  SELECT URL FROM \`post-image\` WHERE post_id = ? AND state = 'EXIST'
  ORDER BY id ASC
`;

//공지글별 댓글 조회 (커서 없는 초기값)
export const getCommentsByPostIdAtFirst = `
  SELECT c.id, ur.nickname, c.content, c.updated_at FROM comment c
  JOIN post p ON p.id = ? AND c.post_id = p.id
  LEFT JOIN \`user-room\` ur ON c.user_id = ur.user_id
  WHERE c.state = 'EXIST'
  ORDER BY c.id ASC LIMIT ?
`;

//공지글별 댓글 조회 (커서 존재)
export const getCommentsByPostId = `
  SELECT c.id, ur.nickname, c.content, c.updated_at FROM comment c
  JOIN post p ON p.id = ? AND c.post_id = p.id
  LEFT JOIN \`user-room\` ur ON c.user_id = ur.user_id
  WHERE c.state = 'EXIST' AND c.id < ?
  ORDER BY c.id ASC LIMIT ?
`;

//공지글별 댓글 개수 업데이트
export const updateCommentCountByPostId = `
  UPDATE post p
  SET p.comment_count = (SELECT COUNT(*) FROM comment c WHERE c.state = 'EXIST' AND c.post_id = p.id)
  WHERE p.id = ?
`;
