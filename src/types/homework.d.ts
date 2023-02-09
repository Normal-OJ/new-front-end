interface HomeworkForm {
  name: string;
  start: number;
  end: number;
  markdown: string;
  problemIds: number[];
}

interface HomeworkCreationForm extends HomeworkForm {
  courseName: string;
  scoreboardStatus: 0 | 1;
}

interface HomeworkEditionForm extends HomeworkForm {
  scoreboardStatus: 0 | 1;
  name?: string;
}

type HomeworkStudentStatus = {
  [username: string]: {
    [pid: string]: {
      score: number;
    };
  };
};

interface HomeworkPreviewForm extends HomeworkForm {
  id: string;
  studentStatus: HomeworkStudentStatus;
}

interface Homework extends HomeworkForm {
  studentStatus: HomeworkStudentStatus;
}

interface HomeworkListItem extends Homework {
  id: string;
}

type HomeworkList = HomeworkListItem[];
