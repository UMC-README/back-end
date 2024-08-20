import {
  insertUser,
  findUserById,
  findUserByEmail,
  findFixedPostByUserId,
  findCreateRoomByUserId,
  findJoinRoomByUserId,
  findRoomByUserId,
  updateUserProfileById,
  updateUserPasswordById,
  updateUserRoomProfileById,
  findDuplicateNickname,
  findLatestPostInRoom,
  findAllRooms,
  getRoomsCount,
  findSubmitCountInRoom,
  findSubmitList,
  findSubmitImages,
  findPenaltyPost,
  findPenaltyCount,
  findHavePostRoomByUserId,
  getHavePostRoomCount,
} from "./user.dao.js";
import { passwordHashing } from "../../utils/passwordHash.js";
import { generateJWTToken } from "../../utils/generateToken.js";
import {
  getRelativeTime,
  getYearMonthDay,
  getYearMonthDayHourMinute,
} from "../../utils/timeChange.js";

export const signupUser = async (userInfo, token) => {
  // 비밀번호 해싱
  const hashedPassword = passwordHashing(userInfo.password.toString());

  const userId = await insertUser({
    ...userInfo,
    password: hashedPassword,
  });

  const accessToken = generateJWTToken(userId);

  return {
    userId,
    nickname: userInfo.nickname,
    accessToken: token ?? accessToken,
  };
};

export const loginUser = async (email, password) => {
  const userData = await findUserByEmail(email);

  if (!userData) {
    throw new Error("등록되지 않은 이메일 입니다.");
  }

  // 입력된 비밀번호 해싱
  const hashedPassword = passwordHashing(password);

  if (hashedPassword === userData.password) {
    const tokenInfo = generateJWTToken(userData.id);

    return {
      userId: userData.id,
      accessToken: tokenInfo,
    };
  } else {
    throw new Error("비밀번호가 일치하지 않습니다.");
  }
};

export const kakaoLoginUser = async (email) => {
  const userData = await findUserByEmail(email);

  if (!userData) {
    return false;
  }
  return true;
};

export const getUserProfile = async (userId) => {
  const userData = await findUserById(userId);

  if (!userData) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  return {
    userId: userData.id,
    name: userData.name,
    nickname: userData.nickname,
    email: userData.email,
    profileImage: userData.profile_image,
  };
};

export const verifyUserPassword = async (userId, password) => {
  const userData = await findUserById(userId);

  if (!userData) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  const hashedPassword = passwordHashing(password);

  return hashedPassword === userData.password;
};

export const updatePassword = async (userId, password) => {
  const userData = await findUserById(userId);

  if (!userData) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  const hashedPassword = passwordHashing(password);

  await updateUserPasswordById(userId, hashedPassword);

  return true;
};

export const updateBasicProfile = async (userId, name, nickname, profileImage) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  await updateUserProfileById(userId, name, nickname, profileImage);

  return true;
};

export const updateRoomProfile = async (userId, roomId, nickname, profileImage) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  await updateUserRoomProfileById(userId, roomId, nickname, profileImage);

  return true;
};

export const getMyFixedPost = async (userId) => {
  const userData = await findUserById(userId);

  if (!userData) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  const fixedPostData = await findFixedPostByUserId(userId);

  if (!fixedPostData) {
    return null;
  }

  return {
    roomId: fixedPostData.room_id,
    postId: fixedPostData.id,
    title: fixedPostData.title,
    startDate: getYearMonthDay(fixedPostData.start_date),
    endDate: getYearMonthDay(fixedPostData.end_date),
  };
};

export const getMyRoomProfiles = async (userId, page, pageSize) => {
  const userData = await findUserById(userId);

  if (!userData) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  const rooms = await findRoomByUserId(userId, page, pageSize);

  if (!rooms) {
    return {
      nickname: userData.nickname,
      profileImage: userData.profile_image,
      profiles: [],
    };
  }

  return {
    nickname: userData.nickname,
    profileImage: userData.profile_image,
    profiles: rooms,
  };
};

export const getMyCreateRoom = async (userId, page, pageSize) => {
  const { rooms, isNext, totalCount } = await findCreateRoomByUserId(userId, page, pageSize);

  if (!rooms) {
    return { rooms: [], isNext: false, totalPages: 0 };
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  const Myrooms = rooms.map((room) => ({
    id: room.room_id,
    nickname: room.user_nickname,
    roomName: room.room_name,
    roomImage: room.room_image,
    state: room.state,
    latestPostTime: getRelativeTime(room.latest_post_time),
  }));

  return { rooms: Myrooms, isNext, totalPages };
};

export const getMyJoinRoom = async (userId, page, pageSize) => {
  const { rooms, isNext, totalCount } = await findJoinRoomByUserId(userId, page, pageSize);

  if (!rooms) {
    return { rooms: [], isNext: false, totalPages: 0 };
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  const Myrooms = rooms.map(async (room) => {
    const submitCount = await findSubmitCountInRoom(room.room_id, userId);
    return {
      id: room.room_id,
      nickname: room.user_nickname,
      roomName: room.room_name,
      roomImage: room.room_image,
      state: room.state,
      latestPostTime: getRelativeTime(room.latest_post_time),
      submitCount,
      maxPenaltyCount: room.max_penalty_count,
      penaltyCount: room.penalty_count,
    };
  });

  const RoomDatas = await Promise.all(Myrooms);

  return { rooms: RoomDatas, isNext, totalPages };
};

export const checkRoomDuplicateNickname = async (roomId, nickname) => {
  const isDuplicate = await findDuplicateNickname(roomId, nickname);

  return isDuplicate;
};

export const getLatestPostsInAllRooms = async (userId, page, pageSize) => {
  try {
    const rooms = await findHavePostRoomByUserId(userId, page, pageSize);
    const totalCount = await getHavePostRoomCount(userId);

    const totalPages = Math.ceil(totalCount / pageSize);

    const recentPostsPromises = rooms.map(async (room) => {
      const recentPost = await findLatestPostInRoom(room.roomId);

      return recentPost
        ? {
            roomId: room.id,
            roomName: room.room_name,
            postId: recentPost.post_id,
            title: recentPost.title,
            createdAt: getRelativeTime(recentPost.created_at),
          }
        : null;
    });

    const recentPostList = (await Promise.all(recentPostsPromises)).filter((post) => post !== null);
    const isNext = page * pageSize < totalCount;

    return { recentPostList, isNext, totalPages };
  } catch (error) {
    console.log("오류 발생: 최근 공지글 목록 조회", error);
    throw new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

export const getSubmitList = async (userId, roomId) => {
  const submits = await findSubmitList(userId, roomId);

  const detailedSubmitsPromises = submits.map(async (submit) => {
    const images = await findSubmitImages(submit.submit_id);

    return {
      postId: submit.post_id,
      nickname: submit.user_nickname,
      profileImage: submit.profile_image,
      submitState: submit.submit_state,
      content: submit.content,
      images: images.length > 0 ? images : [],
    };
  });

  const detailedSubmits = await Promise.all(detailedSubmitsPromises);

  return detailedSubmits;
};

export const getPenaltyPostList = async (roomId, userId) => {
  const penaltyCount = await findPenaltyCount(roomId, userId);
  const posts = await findPenaltyPost(roomId, userId);

  const postLists = posts.map((post) => {
    const imagesArray = post.images ? post.images.split(",") : [];

    return {
      postId: post.id,
      type: post.type,
      submitState: post.submit_state,
      title: post.title,
      content: post.content,
      startDate: getYearMonthDayHourMinute(post.start_date),
      endDate: getYearMonthDayHourMinute(post.end_date),
      image: imagesArray[0] || null,
    };
  });

  return {
    penaltyCount: penaltyCount.myPenaltyCount,
    maxPenalty: penaltyCount.maxPenalty,
    posts: postLists,
  };
};
