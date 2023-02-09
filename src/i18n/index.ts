import chinese from "./chinese";
import english from "./english";
import taiwanese from "./taiwanese";

export const config = {
  legacy: false,
  locale: "chinese",
  fallbackLocale: "chinese",
  messages: {
    chinese,
    english,
    taiwanese,
  },
};
