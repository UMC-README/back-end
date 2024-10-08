export const getRelativeTime = (timestamp) => {
  if (!timestamp) {
    return null;
  }

  const now = new Date();
  const time = new Date(timestamp);
  const diff = now - time;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 12 * month;

  if (diff < minute) {
    return "방금 전";
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes}분 전`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours}시간 전`;
  } else if (diff < month) {
    const days = Math.floor(diff / day);
    return `${days}일 전`;
  } else if (diff < year) {
    const months = Math.floor(diff / month);
    return `${months}개월 전`;
  } else {
    const years = Math.floor(diff / year);
    return `${years}년 전`;
  }
};

export const getYearMonthDay = (timestamp) => {
  const date = new Date(timestamp);

  const year = date.getUTCFullYear().toString().slice(-2);
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");

  return `${year}.${month}.${day}`;
};

export const getYearMonthDayHourMinute = (timestamp) => {
  const date = new Date(timestamp);

  const year = date.getUTCFullYear().toString().slice(-2);
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  const hour = date.getUTCHours().toString().padStart(2, "0");
  const minute = date.getUTCMinutes().toString().padStart(2, "0");

  return `${year}.${month}.${day} ${hour}:${minute}`;
};
