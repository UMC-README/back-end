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

//공지방 내 포스트 정보, 나의 제출상태 가져오기 (커서 존재)
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

//공지방 내 포스트 정보, 나의 제출상태 가져오기 (커서 없는 초기값)
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

//공지글별 댓글 개수 업데이트
export const updateCommentCountByPostId = `
  UPDATE post p
  SET p.comment_count = (SELECT COUNT(*) FROM comment c WHERE c.state = 'EXIST' AND c.post_id = p.id)
  WHERE p.id = ?
`;
