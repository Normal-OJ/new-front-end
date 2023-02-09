// the fourth one is handwritten, which wont show in submission list
export const LANG = ["c", "cpp", "py3", ""];
export const LANGUAGE_OPTIONS: LangOption[] = [
  { value: 0, text: "c", mask: 1 },
  { value: 1, text: "cpp", mask: 2 },
  { value: 2, text: "py", mask: 4 },
];

export const ROLE = ["Admin", "Teacher", "Student"];

// keyof SUBMISSION_STATUS_REPR please refer to '@/types/submission.d.ts'
export const SUBMISSION_STATUS_REPR = {
  [-1]: {
    label: "Pending",
    color: "#9e675a",
  },
  [0]: {
    label: "Accepted",
    color: "#00C853",
  },
  [1]: {
    label: "Wrong Answer",
    color: "#F44336",
  },
  [2]: {
    label: "Compile Error",
    color: "#DD2C00",
  },
  [3]: {
    label: "Time Limit Exceed",
    color: "#9c56a8",
  },
  [4]: {
    label: "Memory Limit Exceed",
    color: "#FF9800",
  },
  [5]: {
    label: "Runtime Error",
    color: "#2196F3",
  },
  [6]: {
    label: "Judge Error",
    color: "#a65a5c",
  },
  [7]: {
    label: "Output Limit Exceed",
    color: "#BF360C",
  },
} as const;
