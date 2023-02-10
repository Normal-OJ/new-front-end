export default {
  settings: {
    title: "Settings",
    select_lang: "Select your preferred language",
  },
  about: {
    contributor:"Contributor",
    links:"Links",
    maintainer:"Maintainer",
    service_l_2021: "NTNU CSIE Service Learning 2021 Spring",
    swe_2019: "Red Team of Software Engineering 2019 Fall",
  },
  course: {
    ann: {
      index: {
        title:"Announcements",
        err:"Oops! Something went wrong when loading announcements.",
        table: {
          title: "Title",
          author: "Author",
          time: "Create At",
        },
      },
    },
    hw: {
      index: {
        title: "Homeworks",
        new: "New",
        err: "Oops! Something went wrong when loading homeworks."
      },
    },
    problem: {
      submit: {
        err: {
          code: "Please paste your source code to submit.",
          lang: "Please select the programming language.",
          msg: "Oops! Something went wrong when submitting the code. Try again later.",
        },
        card: {
          title: "Submit to problem #",
          placeholder: "Paste your code here",
        },
        lang: {
          text: "Language",
          select: "Select language",
        },
        text: "Submit",
      },
    },
    problems: {
      text: "Problems",
      id: "ID",
      name: "Name",
      tags: "Tags",
      quota: "Quota",
    },
    submissions: {
      text: "Submissions",
      problem: "Problem",
      status: "Status",
      lang: "Language",
      clear: "Clear",
      table: {
        id: "id",
        pid: "pid",
        user: "user",
        result: "result",
        score: "score",
        r_time: "run time",
        mem: "memory",
        lang: "lang",
        time: "time",
      },
    },
    submission: {
      title: "Submission ",
      general: {
        title: "General",
        problem: "Problem",
        user: "User",
        status: "Status",
        rt: "Run Time",
        mem: "Memory",
        score: "Score",
        lang: "Lang",
        time: "Time",
      },
      detail: {
        title: "Detail",
        desc: "Pending submission will be refetched automatically.",
        id: "#",
        status: "Status",
        rt: "Run Time",
        mem: "Memory",
        score: "Score",
        overall: "Overall",
        result: {
          hide: "Hide all results",
          show: "Show all results",
        },
      },
      source: {
        text: "Source",
        copied: "Copied!",
        copy: "Copy",
      },
    },
  },
  index: {
    ann: "Announcements",
    error: "Oops! Something went wrong when loading announcements.",
    title: "Title",
    create_t: "Create At",
    login_f: "Login Failed: Your username/email or password is incorrect",
    username: "Username / Email",
    pw: "Password",
    placeholder: {
      username: "username or email",
      pw: "password",
    },
  },
  profile: {
    title: "Profile",
    err:{
      new_pw: "Please fill out this field.",
      old_pw: "Please fill out this field.",
      confirm_pw: {
        required: "Please fill out this field.",
        sameAsRef: "Password does not match.",
      },
    },
    username: "Username",
    dispname: "Display Name",
    email: "Email",
    role: "Role",
    pw: {
      change: "Change Password",
      change_msg:  "Password has been successfully changed",
      new: "New Password",
      confirm: "Confirm New Password",
      current: "Current Password",
      placeholder: {
        new: "new password",
        again: "new password again",
        current: "current password",
      },
      submit: "Submit",
    },
  },
  ann: {
    id: {
      back: "Back",
    },
  },
  components: {
    hw: {
      hwCard: {
        statusLabel: {
          running: "RUNNING",
          notStart: "NOT START",
          over: "OVER",
        },
        availability:{
          text: "Availability",
          from: "From",
          due: "Due",
        },
        problems: {
          text: "Problems",
          id: "#",
          pid: "PID",
          name: "Name",
          quota: "Quota",
          score: "Score",
          stats: "Stats",
          copycat: "Copycat",
        },
        description: {
          text: "Description",
          edit: "Edit",
          stats: "Stats",
        },
      },
      hwForm: {

      },
    },
    problem: {
      forms: {
        probDescForm: {
          desc: "Description",
          input: "Input",
          output: "Output",
          hint: "Hint",
          err: {
            input: "Sample Input Error: ",
            output: "Sample Output Error: ",
          },
          sample: {
            input: "Sample Input ",
            output: "Sample Output ",
          },
        },
      },
      probCard: {
        title: "Problem #",
        quota: "Quota",
        score: "Score",
        submit: "Submit",
        stats: "Stats",
        card: {
          desc: "Description",
          input: "Input",
          output: "Output",
          ex: "Examples",
          sample: {
            id: "#",
            input: "Input",
            output: "Output",
            no: {
              input: "no input",
              output: "no output",
            },
          },
          hint: "Hint",
          subtasks: {
            title: "Subtasks",
            id: "#",
            tl: "Time Limit",
            ml: "Memory Limit",
            score: "Score",
          },
        },
      },
    },  
    courseSideBar: {
      ann: "Announcements",
      hw: "Homeworks",
      prob: "Problems",
      submit: "Submissions",
    }, 
    courseTopBar: {

    },
    sideBar: {
      home: "Home",
      course: "Course",
      about: "About",
      admin: "Admin",
      profile: "Profile", 
    },
  },
  constant: {
    submissionStatus: {
      pending: "Pending",
      ac: "Accepted",
      wa: "Wrong Answer",
      ce: "Compile Error",
      tle: "Time Limit Exceed",
      mle: "Memory Limit Exceed",
      re: "Runtime Error",
      je: "Judge Error",
      ole: "Output Limit Exceed",
    },
  },
};
