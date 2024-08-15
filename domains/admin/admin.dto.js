export const createRoomsDTO = (createRoomsData) => {
  return {
    ...createRoomsData,
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