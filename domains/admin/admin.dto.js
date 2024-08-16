export const createRoomsDTO = (roomData) => {
  return {
    roomId : roomData.roomId, 
    roomImage : roomData.room_image, 
    adminNickname: roomData.admin_nickname,
    roomName: roomData.room_name,
    roomPassword: roomData.room_password,
    maxPenalty: roomData.max_penalty,
    roomInviteUrl : roomData.roomInviteUrl, 
  };
};

export const updateRoomsDTO = (updateRoomsData) => {
  return {
    ...updateRoomsData,
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

export const userSubmitDTO = (userSubmissions, submitStates) => {
  const pendingStates = submitStates.filter(state => state.submit_state === 'PENDING');
  const completeStates = submitStates.filter(state => state.submit_state === 'COMPLETE');

  return { userSubmissions, pendingStates, completeStates };
}