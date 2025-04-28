interface User {
  username: string;
  displayedName: string;
  bio: string;
  role: number;
  email: string;
  md5: string;
  active: boolean;
}

type UserInfo = Pick<User, "username" | "displayedName" | "role" | "md5">;

interface UserSummary {
  userCount: number;
  breakdown: {
    role: string;
    count: number;
  }[];
}

interface UserEditorConfig {
  fontSize: number;
  theme: string;
  indentType: 0 | 1;
  tabSize: number;
  language: 0 | 1 | 2;
}

interface UserProperties extends User {
  editorConfig: UserEditorConfig;
}

interface UserEditionForm {
  password: string | null;
  displayedName: string;
  role: number;
}

interface CheckEmail {
  valid: number; // 1 for valid/unused email
}
