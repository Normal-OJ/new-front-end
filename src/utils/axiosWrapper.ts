import axios from "axios";

interface RequestType<T extends Function> {
  fn: T;
  parameters: T extends (...args: infer U) => any ? U : never;
}
function axiosErrorWrapper(error: any): string {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  return "Unknown error occurred :(";
}
export async function axiosRequestWrapper<
  F extends Function,
  R extends F extends (...args: any[]) => infer R ? R : never,
>(req: RequestType<F>): Promise<[R | null, string | null]> {
  let res: R | null = null;
  try {
    if (req.parameters) {
      res = await req.fn(...req.parameters);
    } else {
      res = req.fn();
    }
  } catch (error) {
    const errorMsg = axiosErrorWrapper(error);
    return [null, errorMsg];
  }
  return [res, null];
}
