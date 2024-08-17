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

export const updateRoomsDTO = (beforeRoomsData) => { 
  return{ BeforeRoomsData : beforeRoomsData[0], message : "공지방 수정에 성공하였습니다."};
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

  const UserSubmissions = userSubmissions.map(submission => {
    const startDate = new Date(submission.start_date);  
    const year = String(startDate.getFullYear()).slice(-2);  
    const month = String(startDate.getMonth() + 1).padStart(2, '0');  
    const day = String(startDate.getDate()).padStart(2, '0'); 

    const endDate = new Date(submission.end_date); 
    const year1 = String(endDate.getFullYear()).slice(-2);  
    const month1 = String(endDate.getMonth() + 1).padStart(2, '0');  
    const day1 = String(endDate.getDate()).padStart(2, '0'); 
    
    const formattedStartDate = `${year}.${month}.${day}`;
    const formattedEndDate = `${year1}.${month1}.${day1}`;
    return { ...submission, start_date : formattedStartDate, end_date : formattedEndDate };
  });
  return {  UserSubmissions, pendingStates, completeStates };
}