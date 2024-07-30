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
    return "NOT_COMPLETE";
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

export const notCheckedPostInRoomDTO = (data) => {
  const length = 3;

  const posts = data.map((post) => ({
    roomName: post.room_name,
    postId: post.id,
    postTitle: post.title,
    updatedAtBefore: elapsedTime(post.updatedAtBeforeSec),
  }));

  return { posts };
};

const elapsedTime = (data) => {
  const seconds = data;
  if (seconds < 60) return "방금 전";

  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.floor(minutes)}분 전`;

  const hours = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)}시간 전`;

  const days = hours / 24;
  if (days < 7) return `${Math.floor(days)}일 전`;

  const months = days / 30;
  if (months < 12) return `${Math.floor(months)}개월 전`;

  const years = months / 12;
  return `${Math.floor(years)}년 전`;
};

export const detailedPostDTO = (data) => {
  const post = data.map((result) => ({
    postId: result.id,
    postType: result.type,
    postTitle: result.title,
    postBody: result.content,
    postImages: result.URLs,
    startDate: formatDate(result.start_date),
    endDate: formatDate(result.end_date),
    commentCount: result.comment_count,
    submitState: formatSubmitState(result.submit_state),
  }));

  return { post };
};
