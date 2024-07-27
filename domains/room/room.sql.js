// 고정 공지글 변경
export const changeFixedPostSQL = `
  UPDATE user SET fixed_post_id = ? WHERE id = ?
`;

// ID 값으로 공지글 찾기
export const getPostById = `
  SELECT * FROM post WHERE id = ?
`;

//공지방 내 포스트 정보 가져오기 (커서 존재)
export const getPostDetailsByRoomId = `
  SELECT p.type, p.title, p.content, p.start_date, p.end_date, p.comment_count
  FROM post p
  WHERE p.room_id = ? AND p.id < ?
  ORDER BY p.id DESC LIMIT ?
`;

//공지방 내 포스트 정보 가져오기 (커서 없는 초기값)
export const getPostDetailsByRoomIdAtFirst = `
  SELECT p.type, p.title, p.content, p.start_date, p.end_date, p.comment_count
  FROM post p
  WHERE p.room_id = ? AND p.state = 'EXIST'
  ORDER BY p.id DESC LIMIT ?
`;

//공지방 내 나의 제출상태 가져오기 (커서 존재)
export const getSubmitStatesByRoomId = `
  SELECT s.submit_state
  FROM submit s, post p, user u
  WHERE p.state = 'EXIST' AND p.room_id = ? AND p.id < ? AND u.id = ? AND s.post_id = p.id AND s.user_id = u.id
  ORDER BY p.id DESC LIMIT ?
`;

//공지방 내 나의 제출상태 가져오기 (커서 없는 초기값)
export const getSubmitStatesByRoomIdAtFirst = `
  SELECT s.submit_state
  FROM submit s, post p, user u
  WHERE p.state = 'EXIST' AND p.room_id = ? AND u.id = ? AND s.post_id = p.id AND s.user_id = u.id
  ORDER BY p.id DESC LIMIT ?
`;

//공지글별 댓글 개수 업데이트
export const updateCommentCountByPostId = `
  UPDATE post p
  SET p.comment_count = (SELECT COUNT(*) FROM comment c WHERE c.state = 'EXIST' AND c.post_id = p.id)
  WHERE p.id = ?
`;
