// 고정 공지글 변경
export const changeFixedPostSQL = `
    UPDATE User SET fixed_post_id = ? WHERE id = ?
`;
