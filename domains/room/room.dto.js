export const allPostInRoomDTO = (data) => {
  const posts = [];

  for (let i = 0; i < data.length; i++) {
    posts.push({
      post_type: data[i].type,
      post_title: data[i].title,
      post_body: data[i].content,
      post_image: data[i].URL,
      submit_state: data[i].submit_state,
      comment_count: data[i].comment_count,
      start_date: formatDate(data[i].start_date),
      end_date: formatDate(data[i].end_date),
    });
  }
  return { postData: posts, cursorId: data[data.length - 1].id };
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat("kr").format(new Date(date)).replaceAll(" ", "").slice(0, -1);
};
