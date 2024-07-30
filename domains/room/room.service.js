import {
  deleteFixPostDao,
  fixPostDao,
  getAllPostInRoomDao,
  getNotCheckedPostInRoomDao,
  getDetailedPostDao,
} from "./room.dao.js";
import { allPostInRoomDTO, notCheckedPostInRoomDTO, detailedPostDTO } from "./room.dto.js";

export const postFix = async (postId, userId) => {
  const fixPostData = await fixPostDao({
    postId,
    userId,
  });

  if (fixPostData == -1) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  if (fixPostData == -2) {
    throw new Error("공지글을 찾을 수 없습니다.");
  }

  return fixPostData;
};

export const deletePostFix = async (userId) => {
  const fixPostData = await deleteFixPostDao({
    userId: userId,
  });

  if (fixPostData == -1) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  return fixPostData;
};

export const getAllPostInRoom = async (roomId, userId, query) => {
  const { postId, size = 10 } = query;

  const roomData = await getAllPostInRoomDao(roomId, userId, postId, size);

  if (getAllPostInRoomDao == -1) {
    throw new Error("공지방을 찾을 수 없습니다.");
  }

  return allPostInRoomDTO(roomData);
};

export const getNotCheckedPostInRoom = async (roomId, userId) => {
  const roomData = await getNotCheckedPostInRoomDao(roomId, userId);

  if (getNotCheckedPostInRoomDao == -1) {
    throw new Error("공지방을 찾을 수 없습니다.");
  }

  return notCheckedPostInRoomDTO(roomData);
};

export const getDetailedPostSer = async (postId, userId) => {
  const roomData = await getDetailedPostDao(postId, userId);

  if (getDetailedPostDao == -1) {
    throw new Error("공지글을 찾을 수 없습니다.");
  }

  return detailedPostDTO(roomData);
};
