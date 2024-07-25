// 고정 공지글 변경
export const changeFixedPostSQL = `
    UPDATE user SET fixed_post_id = ? WHERE id = ?
`;

// ID 값으로 공지글 찾기
export const getPostById = `
  SELECT * FROM post WHERE id = ?
`;
