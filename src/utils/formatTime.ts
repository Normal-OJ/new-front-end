import dayjs from "dayjs";

export const formatTime = (time: number) => {
  return dayjs(time * 1000).format("YYYY-MM-DD HH:mm");
};
