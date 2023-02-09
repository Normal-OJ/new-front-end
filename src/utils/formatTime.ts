import dayjs from "dayjs";
import 'dayjs/locale';
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

let lang : string;

switch (locale.value) {
  case 'chinese' : 
    lang = 'zh-tw';
    break;
  case 'english' :
    lang = 'en';
    break;
  case 'taiwanese' :
    lang = 'zh-tw';
    break;
}
export const formatTime = (time: number) => {
  return dayjs(time * 1000).locale(lang).format("YYYY-MM-DD HH:mm");
};
