export const getToday = () => {
  const UTCtime = new Date(new Date().setHours(0, 0, 0, 0));
  const today = new Date(new Date(UTCtime).setHours(UTCtime.getHours() + 9));
  return today.getTime();
};

export const getDate = (date) => {
  const convertDate = new Date(`20${date}`);
  const hour = convertDate.getHours() + 9;
  return new Date(new Date(convertDate).setHours(hour)).getTime();
};

export const isInvalidDate = (startDate, endDate) =>
  isNaN(new Date(`20${startDate}`)) || isNaN(new Date(`20${endDate}`));

export const getNow = () => {
  const locale = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
  const today = new Date(locale);
  return today;
};
