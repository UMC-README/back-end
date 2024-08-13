// 회원가입
export const userSignUpSQL = `
    INSERT INTO user (name, nickname, email, password) VALUES (?, ?, ?, ?)
`;

// ID 값으로 User 찾기
export const getUserById = `
  SELECT * FROM user WHERE id = ?
`;

// 이메일로 User 찾기
export const getUserByEmail = `
  SELECT * FROM user WHERE email = ?
`;

// 사용자 기본 프로필 수정
export const updateUserProfile = `
  UPDATE user
  SET name = ?, nickname = ?, profile_image = ?
  WHERE id = ?
`;

// 공지방 별 프로필 수정
export const updateUserRoomProfile = `
  UPDATE \`user-room\`
  SET nickname = ?, profile_image = ?
  WHERE user_id = ? AND room_id = ?
`;

// 사용자와 방의 운영진 확인
export const selectAdminId = `
  SELECT admin_id 
  FROM room
  WHERE id = ? AND admin_id = ?
`;

// 사용자가 공지방의 운영진인 경우 공지방의 운영진 닉네임 변경
export const updateRoomAdminNickname = `
  UPDATE room
  SET admin_nickname = ?
  WHERE id = ? AND admin_id = ?
`;

// 사용자 비밀번호 변경
export const updateUserPassword = `
  UPDATE user
  SET password = ?
  WHERE id = ?
`;

// 고정된 공지 찾기
export const getFixedPost = `
  SELECT p.*
  FROM user u
  JOIN post p ON u.fixed_post_id = p.id
  WHERE u.id = ?
`;

// 모든 공지방 찾기 (내가 개설한 공지방과 입장한 공지방)
export const getAllRooms = `
  SELECT ur.nickname, ur.profile_image, r.room_name, r.id, r.admin_id
  FROM \`user-room\` ur
  JOIN room r ON r.id = ur.room_id
  WHERE ur.user_id = ?
  LIMIT ?
  OFFSET ?
`;

// 공지방 개수 찾기 (페이지네이션을 위한 전체 개수)
export const getAllRoomsCount = `
  SELECT COUNT(*) as count
  FROM \`user-room\` ur 
  JOIN room r ON r.id = ur.room_id
  WHERE ur.user_id = ?
`;

// 개설한 공지방 개수 구하기
export const getCreateRoomCount = `
  SELECT COUNT(*) as count
  FROM \`user-room\` ur
  JOIN user u ON u.id = ur.user_id
  JOIN room r ON r.id = ur.room_id
  WHERE r.admin_id = ?
`;

// 개설한 공지방 찾기
export const getCreateRoom = `
  SELECT r.id as room_id, r.admin_nickname as user_nickname, r.room_name, r.room_image, r.state, MAX(post.created_at) as latest_post_time
  FROM room r
  LEFT JOIN post ON r.id = post.room_id
  WHERE  r.admin_id = ?
  GROUP BY r.id
  LIMIT ?
  OFFSET ?
`;

// 입장한 공지방 개수 구하기
export const getJoinRoomCount = `
  SELECT COUNT(*) as count
  FROM \`user-room\` ur
  JOIN user u ON u.id = ur.user_id
  JOIN room r ON r.id = ur.room_id
  WHERE u.id = ? AND r.admin_id <> ?
`;

// 내가 입장한 공지방 찾기
export const getJoinRoom = `
  SELECT room.id as room_id, ur.nickname as user_nickname, room.room_name, room.room_image, room.state, room.max_penalty as max_penalty_count, ur.penalty_count, MAX(post.created_at) as latest_post_time
  FROM room
  JOIN \`user-room\` ur ON room.id = ur.room_id
  LEFT JOIN post ON room.id = post.room_id
  WHERE ur.user_id = ? AND room.admin_id <> ?
  GROUP BY room.id, ur.nickname
  LIMIT ?
  OFFSET ?
`;

// 닉네임 중복 확인
export const checkDuplicateNickname = `
  SELECT COUNT(*) as count
  FROM \`user-room\`
  WHERE room_id = ? AND nickname = ?
`;

// 가장 최근의 공지글 찾기
export const getLatestPostInRoom = `
  SELECT p.id as post_id, p.title, p.created_at
  FROM post p
  WHERE p.room_id = ? AND p.state = 'EXIST'
  ORDER BY p.created_at DESC
  LIMIT 1
`;

// 공지방에 대한 내 submit (MISSION) 개수 찾기
export const getSubmitCountInRoom = `
  SELECT COUNT(*) as submit_count
  FROM submit s
  JOIN post p ON s.post_id = p.id
  WHERE p.room_id = ? AND s.user_id = ? AND s.submit_state IN ('COMPLETE', 'PENDING', 'REJECT') AND p.type = 'MISSION'
`;

// 공지방에 대한 내 submit 목록 조회하기
export const getSubmitListInRoom = `
  SELECT s.id as submit_id, s.submit_state, s.content, ur.nickname as user_nickname, ur.profile_image
  FROM submit s
  JOIN post p ON s.post_id = p.id
  JOIN \`user-room\` ur ON ur.user_id = s.user_id AND ur.room_id = p.room_id
  WHERE p.room_id = ? AND p.type = 'MISSION'
`;

// Sumbit에 대한 Submit-Image 목록 조회하기
export const getSubmitImages = `
  SELECT si.URL
  FROM \`submit-image\` si
  WHERE si.submit_id = ?
`;

// 페널티를 받은 post 대한 목록 조회하기
export const getPenaltySubmit = `
  SELECT p.*
  FROM post p
  JOIN submit s ON p.id = s.post_id
  WHERE p.room_id = ? AND s.user_id = ? AND s.penalty_state = 1
`;
