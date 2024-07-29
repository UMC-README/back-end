export const allPostInRoomDTO = (data) => {
  const posts = [];

  for (let i = 0; i < data.length; i++) {
    posts.push({
      postId: data[i].id,
      postType: data[i].type,
      postTitle: data[i].title,
      postBody: data[i].content,
      postImage: data[i].URL,
      startDate: formatDate(data[i].start_date),
      endDate: formatDate(data[i].end_date),
      commentCount: data[i].comment_count,
      submitState: formatSubmitState(data[i].submit_state),
    });
  }
  return { postData: posts, cursorId: data[data.length - 1].id };
};

const formatSubmitState = (data) => {
  if (data == null) {
    return "notComplete";
  } else return data;
};

const formatDate = (date) => {
  const options = {
    dateStyle: "short",
    timeStyle: "short",
    hour12: false,
  };
  return new Intl.DateTimeFormat("ko", options).format(new Date(date));
};
