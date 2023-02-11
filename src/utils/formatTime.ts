import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/zh-tw";

export const formatTime = (time: number) => {
  return dayjs(time * 1000).format("YYYY-MM-DD HH:mm");
};
