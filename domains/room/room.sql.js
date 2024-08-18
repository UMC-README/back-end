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
  SELECT p.id, p.type, p.title, p.content, pi.URL, p.start_date, p.end_date, p.comment_count, s.submit_state, p.unread_count FROM post p
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
  SELECT p.id, p.type, p.title, p.content, pi.URL, p.start_date, p.end_date, p.comment_count, s.submit_state, p.unread_count FROM post p
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
  SELECT p.id, p.type, p.title, p.content, p.start_date, p.end_date, p.comment_count, s.submit_state, p.unread_count FROM post p
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
export const getRoomEntranceInfoByURL = `
  SELECT id as roomId, room_name as roomName, room_image as roomImage, admin_nickname as adminNickname
  FROM room WHERE room_invite_url = ? AND state = 'EXIST'
`;

//공지방에 유저가 입장되어있는지 여부 확인
export const checkUserRoomExistenceSQL = `
  SELECT EXISTS (
  SELECT user_id, room_id
  FROM \`user-room\`
  WHERE user_id = ? AND room_id = ? LIMIT 1
  ) AS userRoomExistence
`;

//공지방 비밀번호가 일치하는지 여부 확인
export const checkRoomPasswordSQL = `
  SELECT BINARY r.room_password = ? AS isValidResult FROM room r WHERE r.id = ?
`;

//공지방에 유저를 입장 등록
export const createRoomEntranceSQL = `
  INSERT INTO \`user-room\` (user_id, room_id, nickname) VALUES (?, ?, ?)
`;

//공지방 내 공지글 제목, 내용 대상으로 검색 (커서 존재)
export const searchPostInRoomSQL = `
  SELECT p.id, p.type, p.title, p.content, pi.URL, p.start_date, p.end_date, p.comment_count, s.submit_state, p.unread_count FROM post p
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
  WHERE p.state = 'EXIST' AND p.id < ? AND (p.title LIKE ? OR p.content LIKE ?)
  ORDER BY p.id DESC LIMIT ?
`;

//공지방 내 공지글 제목, 내용 대상으로 검색 (커서 없는 초기값)
export const searchPostInRoomSQLAtFirst = `
  SELECT p.id, p.type, p.title, p.content, pi.URL, p.start_date, p.end_date, p.comment_count, s.submit_state, p.unread_count FROM post p
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
  WHERE p.state = 'EXIST' AND (p.title LIKE ? OR p.content LIKE ?)
  ORDER BY p.id DESC LIMIT ?
`;

//공지방에 가입한 날짜, 공지방 내 현재 페널티 카운트와 최대 페널티 한도 조회
export const getMyRoomJoinDatetimeAndPenaltyCountAndRoomMaxSQL = `
  SELECT ur.created_at AS joinedRoomAt, ur.penalty_count AS penaltyCount, r.max_penalty AS maxPenalty
  FROM \`user-room\` ur
  JOIN room r ON r.id = ? AND r.id = ur.room_id
  WHERE ur.user_id = ?
`;

//공지방 내 미확인 페널티부여 포스트 조회
export const notCheckedPenaltyInRoomSQL = `
  SELECT p.id AS postId, p.title AS postTitle
  FROM post p
  JOIN submit s ON s.user_id = ? AND s.post_id = p.id AND s.penalty_state = true AND s.penalty_checked = false
  JOIN room r ON r.id = ? AND r.id = p.room_id
  WHERE p.state = 'EXIST'
  ORDER BY p.id ASC
`;

//공지방 내 미확인 페널티부여 확인처리
export const checkPenaltyInRoomSQL = `
  UPDATE submit s
  JOIN post p ON s.post_id = p.id AND p.state = 'EXIST'
  JOIN room r ON r.id = ? AND r.id = p.room_id
  SET s.penalty_checked = true
  WHERE s.user_id = ? AND s.penalty_state = true
`;

//공지방 내 최대 페널티 한도 도달로 공지방에서 추방
export const getExiledFromRoomSQL = `
  DELETE ur FROM \`user-room\` ur
  JOIN room r ON r.id = ? AND ur.room_id = r.id
  WHERE ur.user_id = ? AND ur.penalty_count >= r.max_penalty
`;

//공지방 내 시작 기한 전인 공지글 모두 찾기
export const getPostsBeforeStartDateInRoomSQL = `
  SELECT p.id
  FROM post p
  WHERE p.room_id = ? AND p.start_date > NOW() AND p.state = 'EXIST';
`;

export const initializeSubmitWhenUserJoinsRoomSQL = `
  INSERT INTO submit (post_id, user_id, content, submit_state)
  SELECT p.id AS post_id, ? AS user_id, null AS content, 'NOT_COMPLETE' AS submit_state
  FROM post p
  WHERE p.room_id = ? AND p.start_date > NOW() AND p.state = 'EXIST'
`;

export const updateUnreadCountByRoom = `
  UPDATE post p3,
    (SELECT p2.id, (SELECT COUNT(ur.user_id)
      FROM \`user-room\` ur
      JOIN post p ON p.room_id = ur.room_id AND p.id = p2.id
      JOIN submit s ON s.post_id = p.id and s.user_id = ur.user_id
      WHERE ur.user_id NOT IN
      (SELECT s2.user_id FROM submit s2 WHERE s2.submit_state = 'COMPLETE' AND s2.post_id = p.id)) AS unreadCount
    FROM post p2
    WHERE p2.room_id = ?) AS tableA
  SET unread_count = tableA.unreadCount
  WHERE p3.id = tableA.id
`;
