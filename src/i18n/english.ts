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
    },
  },
};
