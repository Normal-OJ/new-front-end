import { computed } from "vue";
import { useAxios } from "@vueuse/integrations/useAxios";
import { fetcher } from "@/models/api";

type ProblemSelections = { value: string; text: string }[];
type ProblemId2Meta = Record<string, { name: string | "-"; quota: number | "-" }>;

export function useProblemSelection(courseName: string) {
  const {
    data: problems,
    error,
    isLoading,
  } = useAxios<ProblemList>(`/problem?offset=0&count=-1&course=${courseName}`, fetcher);

  const problemSelections = computed<ProblemSelections>(() => {
    if (!problems.value) return [];
    return problems.value.map(({ problemId, problemName, quota }) => ({
      value: problemId.toString(),
      text: `${problemId} - ${problemName}`,
      quota: quota >= 0 ? quota : "-",
    }));
  });

  const problemId2Meta = computed<ProblemId2Meta>(() => {
    if (!problems.value) return {};
    return Object.fromEntries(
      problems.value.map((p) => [p.problemId.toString(), { name: p.problemName, quota: p.quota }]),
    );
  });

  return {
    problemSelections,
    problemId2Meta,
    error,
    isLoading,
  };
}
