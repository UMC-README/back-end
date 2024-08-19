import { getYearMonthDayHourMinute } from "../../utils/timeChange.js";

export const createRoomsDTO = (roomData) => {
  return {
    roomId: roomData.roomId,
    roomImage: roomData.room_image,
    adminNickname: roomData.admin_nickname,
    roomName: roomData.room_name,
    roomPassword: roomData.room_password,
    maxPenalty: roomData.max_penalty,
    roomInviteUrl: roomData.roomInviteUrl,
  };
};

export const createPostDTO = (createPostData) => {
  return {
    ...createPostData,
  };
};

export const updatePostDTO = (updatePostData) => {
  return {
    ...updatePostData,
  };
};

export const getRoomsDTO = (roomData) => ({
  roomImage: roomData.room_image,
  adminNickname: roomData.admin_nickname,
  roomName: roomData.room_name,
  roomPassword: roomData.room_password,
  maxPenalty: roomData.max_penalty,
});

export const userSubmitDTO = (userSubmissions, submitStates) => {
  const pendingStates = submitStates.filter((state) => state.submit_state === "PENDING");
  const completeStates = submitStates.filter((state) => state.submit_state === "COMPLETE");

  const procSubmissions = userSubmissions.map((submission) => {
    const startDate = new Date(submission.start_date);
    const year = String(startDate.getFullYear()).slice(-2);
    const month = String(startDate.getMonth() + 1).padStart(2, "0");
    const day = String(startDate.getDate()).padStart(2, "0");

    const endDate = new Date(submission.end_date);
    const year1 = String(endDate.getFullYear()).slice(-2);
    const month1 = String(endDate.getMonth() + 1).padStart(2, "0");
    const day1 = String(endDate.getDate()).padStart(2, "0");

    const formattedStartDate = `${year}.${month}.${day}`;
    const formattedEndDate = `${year1}.${month1}.${day1}`;

    // 해당 submission의 pendingStates와 completeStates 필터링
    const relatedPendingStates = pendingStates.filter((state) => state.submit_id === submission.id);
    const relatedCompleteStates = completeStates.filter(
      (state) => state.submit_id === submission.id
    );

    return {
      ...submission,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      pendingStates: relatedPendingStates,
      completeStates: relatedCompleteStates,
    };
  });

  return { userSubmissions: procSubmissions };
};

export const postListDTO = (post) => ({
  postId: post.id,
  title: post.title,
  content: post.content,
  startDate: getYearMonthDayHourMinute(post.start_date),
  endDate: getYearMonthDayHourMinute(post.end_date),
  image: post.images ? post.images.split(",")[0] : null,
  pendingCount: parseInt(post.pending_count, 10) || 0,
});
