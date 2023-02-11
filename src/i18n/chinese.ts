export default {
  settings: {
    title: "設定",
    select_lang: "選擇語言",
  },
  about: {
    contributor: "貢獻者",
    links: "連結",
    maintainer: "維護人員",
    service_l_2021: "臺師大資工系2021年春季服務學習",
    swe_2019: "2019年秋季軟體工程「紅隊」組",
  },
  course: {
    ann: {
      index: {
        title: "公告",
        err: "Oops! Something went wrong when loading announcements.",
        table: {
          title: "標題",
          author: "發布者",
          time: "發布時間",
        },
      },
    },
    hw: {
      index: {
        title: "作業",
        new: "新增",
        err: "Oops! Something went wrong when loading homeworks.",
      },
    },
    problem: {
      submit: {
        err: {
          code: "請在此貼上你的原始碼以利繳交。",
          lang: "請選擇程式語言。",
          msg: "Oops! Something went wrong when submitting the code. Try again later.",
        },
        card: {
          title: "繳交至題號 ",
          placeholder: "在此貼上程式碼",
        },
        lang: {
          text: "語言",
          select: "選擇語言",
        },
        text: "提交",
      },
      stats: {
        pieTitle: "繳交結果",
        title: "數據檢視－題號",
        general: {
          tried: "已嘗試使用者數量",
          ac: "評判為接受使用者數量",
          acRatio: "評判為接受比率",
          avg: "平均分數",
          sd: "標準差",
        },
        table: {
          rt: {
            title: "執行時間前十名",
            id: "名次",
            user: "使用者",
            rt: "執行時間",
            time: "繳交時間",
          },
          mem: {
            title: "記憶體用量前十名",
            id: "名次",
            user: "使用者",
            mem: "記憶體用量",
            time: "繳交時間",
          },
        },
      },
    },
    problems: {
      text: "題目",
      id: "題號",
      name: "題名",
      tags: "標籤",
      quota: "額度",
    },
    submissions: {
      text: "繳交狀態",
      problem: "題目",
      status: "狀態",
      lang: "語言",
      clear: "清除",
      table: {
        id: "版本號碼 (id)",
        pid: "題號 (pid)",
        user: "使用者 (user)",
        result: "結果 (result)",
        score: "得分 (score)",
        r_time: "執行時間 (run time)",
        mem: "記憶體用量 (memory)",
        lang: "語言 (lang)",
        time: "時間 (time)",
      },
    },
    submission: {
      title: "繳交版本號碼 ",
      general: {
        title: "總覽",
        problem: "題號",
        user: "使用者",
        status: "評判結果",
        rt: "執行時間",
        mem: "記憶體用量",
        score: "得分",
        lang: "語言",
        time: "繳交時間",
      },
      detail: {
        title: "細節",
        desc: "作業正在批改，頁面將會自動更新。",
        id: "子任務",
        status: "評判結果",
        rt: "執行時間",
        mem: "記憶體用量",
        score: "得分",
        overall: "整體結果",
        result: {
          hide: "隱藏所有結果",
          show: "顯示所有結果",
        },
      },
      source: {
        text: "原始碼",
        copied: "已複製！",
        copy: "複製",
      },
    },
  },
  courses: {
    index: {
      list: "課程清單",
      table: {
        course: "課程",
        teacher: "教師",
      },
    },
  },
  index: {
    ann: "公告",
    error: "噢不！載入公告時出現了技術錯誤。",
    title: "標題",
    create_t: "建立時間",
    login_f: "登入失敗：帳號 / 電子郵件地址或是密碼輸入錯誤",
    username: "帳號 / 電子郵件地址",
    pw: "密碼",
    placeholder: {
      username: "帳號 / 電子郵件地址",
      pw: "密碼",
    },
  },
  profile: {
    title: "個人資料",
    err: {
      new_pw: "請填寫此欄位。",
      old_pw: "請填寫此欄位。",
      confirm_pw: {
        required: "請填寫此欄位。",
        sameAsRef: "密碼不符合。",
      },
    },
    username: "帳號",
    dispname: "顯示名稱",
    email: "電子郵件",
    role: "角色",
    pw: {
      change: "變更密碼",
      change_msg: "密碼已成功變更",
      new: "新密碼",
      confirm: "確認新密碼",
      current: "舊密碼",
      placeholder: {
        new: "新密碼",
        again: "再輸入一次新密碼",
        current: "舊密碼",
      },
      submit: "送出",
    },
  },
  ann: {
    id: {
      back: "返回",
    },
  },
  components: {
    hw: {
      hwCard: {
        statusLabel: {
          running: "進行中",
          notStart: "未開始",
          over: "已結束",
        },
        availability: {
          text: "期限",
          from: "自",
          due: "至",
        },
        problems: {
          text: "題目",
          id: "序號",
          pid: "題號",
          name: "題名",
          quota: "額度",
          score: "得分",
          stats: "數據",
          copycat: "抄襲",
        },
        description: {
          text: "說明",
          edit: "編輯",
          stats: "數據",
        },
      },
    },
    problem: {
      forms: {
        probDescForm: {
          desc: "說明",
          input: "輸入",
          output: "輸出",
          hint: "提示",
          err: {
            input: "範例輸入錯誤: ",
            output: "範例輸出錯誤: ",
          },
          sample: {
            input: "範例輸入 ",
            output: "範例輸出 ",
          },
        },
      },
      probCard: {
        title: "題目編號 ",
        quota: "額度",
        score: "得分",
        submit: "提交",
        stats: "數據",
        card: {
          desc: "說明",
          input: "輸入",
          output: "輸出",
          ex: "範例",
          sample: {
            id: "編號",
            input: "輸入",
            output: "輸出",
            no: {
              input: "無輸入",
              output: "無輸出",
            },
          },
          hint: "提示",
          subtasks: {
            title: "子任務",
            id: "編號",
            tl: "執行時間限制",
            ml: "記憶體限制",
            score: "配分",
          },
        },
      },
    },
    courseSideBar: {
      ann: "公告",
      hw: "作業",
      prob: "題目",
      submit: "繳交狀態",
    },
    loginSection: {
      welcome: "歡迎回來， ",
      signin: "登入",
      forgot: "忘記密碼?",
      button: "登入",
    },
    sideBar: {
      home: "首頁",
      course: "課程",
      about: "關於",
      admin: "管理",
      profile: "個人",
    },
    dueCountdown: {
      days: "日",
      hours: "小時",
      min: "分",
      sec: "秒",
    },
  },
  constant: {
    submissionStatus: {
      pending: "批改中",
      ac: "接受",
      wa: "答案錯誤",
      ce: "編譯錯誤",
      tle: "超出執行時間",
      mle: "超出可用記憶體",
      re: "執行時錯誤",
      je: "評判錯誤",
      ole: "超出輸出上限",
    },
  },
};
