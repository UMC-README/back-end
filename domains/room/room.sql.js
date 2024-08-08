// 고정 공지글 변경
export const changeFixedPostSQL = `
  UPDATE user SET fixed_post_id = ? WHERE id = ? AND state = 'EXIST'
`;

// ID 값으로 공지글 찾기
export const getPostById = `
  SELECT * FROM post WHERE id = ? AND state = 'EXIST'
`;

// ID 값으로 공지방 찾기
export const getRoomById = `
  SELECT * FROM room WHERE id = ? AND state = 'EXIST'
`;

//ID 값으로 댓글 찾기
export const getCommentById = `
  SELECT * FROM comment WHERE id = ? AND state = 'EXIST'
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
  SELECT p.id, r.room_name, p.title, TIMESTAMPDIFF(second, p.created_at, CURRENT_TIMESTAMP) as createdAtBeforeSec FROM post p
  JOIN user u ON p.room_id = ? AND u.id = ?
  JOIN room r ON r.id = p.room_id
  LEFT JOIN submit s ON s.post_id = p.id AND s.user_id = u.id
  WHERE p.state = 'EXIST' AND (s.submit_state IS NULL OR s.submit_state = 'NOT_COMPLETE' OR s.submit_state = 'REJECT')
  ORDER BY createdAtBeforeSec ASC LIMIT 3
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
  SELECT c.id, c.user_id, ur.nickname, ur.profile_image, c.content, c.created_at FROM comment c
  JOIN post p ON p.id = ? AND c.post_id = p.id
  LEFT JOIN \`user-room\` ur ON c.user_id = ur.user_id AND p.room_id = ur.room_id
  WHERE c.state = 'EXIST'
  ORDER BY c.id ASC LIMIT ?
`;

//공지글별 댓글 조회 (커서 존재)
export const getCommentsByPostId = `
  SELECT c.id, c.user_id, ur.nickname, ur.profile_image, c.content, c.created_at FROM comment c
  JOIN post p ON p.id = ? AND c.post_id = p.id
  LEFT JOIN \`user-room\` ur ON c.user_id = ur.user_id AND p.room_id = ur.room_id
  WHERE c.state = 'EXIST' AND c.id > ?
  ORDER BY c.id ASC LIMIT ?
`;

//댓글 작성
export const postCommentSQL = `
  INSERT INTO comment (post_id, user_id, content) VALUES (?, ?, ?)
`;

//공지글별 댓글 개수 1 증가
export const increaseCommentCountOneByPostId = `
  UPDATE post p
  SET p.comment_count = p.comment_count + 1
  WHERE p.id = ?
`;

//댓글 삭제 (Soft Delete)
export const deleteCommentSQL = `
  UPDATE comment SET state = 'DELETED' WHERE id = ?
`;

//공지글별 댓글 개수 1 감소
export const decreaseCommentCountOneByPostId = `
  UPDATE post p
  SET p.comment_count = p.comment_count -1
  WHERE p.id = ?
`;

//공지글별 댓글 개수 업데이트
export const updateCommentCountByPostId = `
  UPDATE post p
  SET p.comment_count = (SELECT COUNT(*) FROM comment c WHERE c.state = 'EXIST' AND c.post_id = p.id)
  WHERE p.id = ?
`;

//공지글별 제출 요구사항 조회
export const getSubmitRequirementsSQL = `
  SELECT id, type, question
  FROM post
  WHERE id = ?
`;

//제출 생성 (기존 제출 존재시 업데이트)
export const postSubmitSQL = `
  INSERT INTO submit (post_id, user_id, content, submit_state) VALUES (?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE content = ?, submit_state = ?
`;

//공지글의 안 읽은 인원수 1 감소
export const decreaseUnreadCountOneByPostId = `
  UPDATE post p
  SET p.unread_count = p.unread_count - 1
  WHERE p.id = ?
`;

//제출이미지 생성
export const postSubmitImageSQL = `
  INSERT INTO \`submit-image\` (submit_id, URL) VALUES (?, ?)
`;

//이전 제출이미지 삭제 (Soft Delete)
export const deletePreviousSubmitImageSQL = `
  UPDATE \`submit-image\` si
  JOIN submit s ON s.post_id = ? AND s.user_id = ?
  SET si.state = 'DELETED'
  WHERE si.submit_id = s.id
`;

//포스트 ID와 유저 ID로 제출 ID 찾기
export const getSubmitIdByPostIdAndUserId = `
  SELECT id FROM submit s
  WHERE post_id = ? AND user_id = ?
`;

//공지방 최초 입장시 공지방 정보 가져오기
export const getRoomEntranceInfoByRoomId = `
  SELECT room_name, room_image, admin_nickname FROM room WHERE id = ? AND state = 'EXIST'
`;

//공지방 비밀번호가 일치하는지 여부 확인
export const checkRoomPasswordSQL = `
  SELECT BINARY r.room_password = ? AS isValidResult FROM room r WHERE r.id = ?
`;

//공지방에 유저를 입장 등록
export const createRoomEntranceSQL = `
  INSERT INTO \`user-room\` (user_id, room_id, nickname) VALUES (?, ?, ?)
`;
