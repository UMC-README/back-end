export const allPostInRoomDTO = ({
  roomName,
  isRoomAdmin,
  penaltyCount,
  maxPenalty,
  notCheckedPenalty,
  posts,
}) => {
  if (posts.length == 0) {
    return {
      roomName,
      isRoomAdmin,
      penaltyCount,
      maxPenalty,
      notCheckedPenalty,
      posts,
      cursorId: null,
    };
  }

  const returnPosts = posts.map((post) => ({
    postId: post.id,
    postType: post.type,
    postTitle: post.title,
    postBody: post.content,
    postImage: post.URL,
    startDate: formatDate(post.start_date),
    endDate: formatDate(post.end_date),
    commentCount: post.comment_count,
    submitState: formatSubmitState(post.submit_state),
    unreadCount: post.unread_count,
  }));

  return {
    roomName,
    isRoomAdmin,
    penaltyCount,
    maxPenalty,
    notCheckedPenalty,
    posts: returnPosts,
    cursorId: posts[posts.length - 1].id,
  };
};

const formatSubmitState = (data) => {
  if (data == null) {
    return "NOT_COMPLETE";
  } else return data;
};

export const formatDate = (date) => {
  const options = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  };
  return new Intl.DateTimeFormat("ko", options).format(new Date(date));
};

export const notCheckedPostInRoomDTO = (data) => {
  const posts = data.map((post) => ({
    roomName: post.room_name,
    postId: post.id,
    postTitle: post.title,
    createdAtBefore: elapsedTime(post.createdAtBeforeSec),
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
  if (days < 30) return `${Math.floor(days)}일 전`;

  const months = days / 30;
  if (months < 12) return `${Math.floor(months)}개월 전`;

  const years = months / 12;
  return `${Math.floor(years)}년 전`;
};

export const detailedPostDTO = (data) => {
  const post = data.post.map((result) => ({
    postId: result.id,
    postType: result.type,
    postTitle: result.title,
    postBody: result.content,
    startDate: formatDate(result.start_date),
    endDate: formatDate(result.end_date),
    commentCount: result.comment_count,
    submitState: formatSubmitState(result.submit_state),
    unreadCount: result.unread_count,
  }));

  const imageURLs = data.postImages.map((result) => result.URL);

  return {
    roomName: data.roomName,
    isRoomAdmin: data.isRoomAdmin,
    isJoinedBeforeStartDate: !!data.isJoinedBeforeStartDate,
    post,
    imageURLs,
  };
};

export const allCommentsInPostDTO = (data, userId) => {
  if (data.length == 0) {
    return { data, cursorId: null };
  }

  const isCommentMine = (myUserId, commentUserId) => {
    if (myUserId === commentUserId) {
      return true;
    } else {
      return false;
    }
  };

  const comments = data.map((comment) => ({
    commentId: comment.id,
    isCommentMine: isCommentMine(userId, comment.user_id),
    commentAuthorNickname: comment.nickname,
    commentAuthorProfileImage: comment.profile_image,
    commentBody: comment.content,
    createdAt: formatDate(comment.created_at),
  }));

  return { data: comments, cursorId: data[data.length - 1].id };
};

export const searchPostInRoomDTO = (posts) => {
  if (posts.length == 0) {
    return { posts, cursorId: null };
  }

  const returnPosts = posts.map((post) => ({
    postId: post.id,
    postType: post.type,
    postTitle: post.title,
    postBody: post.content,
    postImage: post.URL,
    startDate: formatDate(post.start_date),
    endDate: formatDate(post.end_date),
    commentCount: post.comment_count,
    submitState: formatSubmitState(post.submit_state),
    unreadCount: post.unread_count,
  }));

  return { posts: returnPosts, cursorId: posts[posts.length - 1].id };
};
