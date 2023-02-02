import axios from "axios";
import { useGlobal } from "@/stores/global";

export const fetcher = axios.create({
  baseURL: (import.meta.env.VITE_APP_API_BASE_URL as string) || "/api",
  withCredentials: true,
});

fetcher.interceptors.response.use(
  (response) => {
    return {
      ...response,
      ...response.data,
    };
  },
  (error) => {
    const global = useGlobal();
    if (error?.response?.status >= 500) {
      global.onServerError();
    }
    throw error;
  },
);

const Auth = {
  getSession: () => fetcher.get<UserProperties>("/auth/me"),
  login: (body: { username: string; password: string }) => fetcher.post("/auth/session", body),
  logout: () => fetcher.get("/auth/session"),
  changePassword: (body: { oldPassword: string; newPassword: string }) =>
    fetcher.post("/auth/change-password", body),
  batchSignup: (body: { newUsers: string; course: string }) => fetcher.post("/auth/batch-signup", body),
};

const Problem = {
  create: (body: ProblemForm) => fetcher.post("/problem/manage", body),
  getTestCaseUrl: (problemId: number) => `${fetcher.defaults.baseURL}/problem/${problemId}/testcase`,
  modify: (id: string | number, body: ProblemForm) => fetcher.put(`/problem/manage/${id}`, body),
  modifyTestdata: (id: string | number, body: FormData) =>
    fetcher.put(`/problem/manage/${id}`, body, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id: string | number) => fetcher.delete(`/problem/manage/${id}`),
};

const Submission = {
  create: (body: { problemId: number; languageType: number }) =>
    fetcher.post<{ submissionId: string }>("/submission", body),
  modify: (id: string, body: FormData) =>
    fetcher.put(`/submission/${id}`, body, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  rejudge: (id: string) => fetcher.get(`/submission/${id}/rejudge`),
};

const Copycat = {
  detect: (body: { course: string; problemId: number; studentNicknames: { [k: string]: string } }) =>
    fetcher.post("/copycat", body),
};

const Announcement = {
  create: (body: AnnouncementCreationForm) => fetcher.post<{ annId: string }>("/ann", body),
  modify: (body: AnnouncementEditionForm) => fetcher.put("/ann", body),
  delete: (body: { annId: string }) => fetcher.delete("/ann", { data: body }),
};

const Homework = {
  create: (body: HomeworkCreationForm) => fetcher.post("/homework", body),
  modify: (id: string, body: HomeworkEditionForm) => fetcher.put(`/homework/${id}`, body),
  delete: (id: string) => fetcher.delete(`/homework/${id}`),
};

const Course = {
  create: (body: CourseForm) => fetcher.post("/course", body),
};

export default {
  Auth,
  Problem,
  Submission,
  Copycat,
  Announcement,
  Homework,
  Course,
};
