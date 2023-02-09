interface CourseListItem {
  course: string;
  teacher: UserInfo;
}

type CourseList = CourseListItem[];

interface Course {
  teacher: UserInfo;
  TAs: UserInfo[];
  students: UserInfo[];
}

interface CourseForm {
  course: string;
  teacher: UserInfo["username"];
}
