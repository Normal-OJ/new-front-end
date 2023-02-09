import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export const timeFromNow = (timestamp: number | string) => {
  if (typeof timestamp === "number") {
    return dayjs(timestamp * 1000).fromNow();
  }
  return dayjs(timestamp).fromNow();
};
