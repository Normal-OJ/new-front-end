import axios from "axios";

interface RequestHandler<T extends Function> {
  callback: T;
  parameters: T extends (...args: infer U) => unknown ? U : never;
}
function axiosErrorWrapper(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  return "Unknown error occurred :(";
}
export async function axiosRequestWrapper<
  F extends Function,
  R extends F extends (...args: unknown[]) => infer R ? R : never,
>(req: RequestHandler<F>): Promise<[null, string] | [R, null]> {
  let res: R;
  try {
    if (req.parameters) {
      res = await req.callback(...req.parameters);
    } else {
      res = req.callback();
    }
  } catch (error) {
    const errorMsg = axiosErrorWrapper(error);
    return [null, errorMsg];
  }
  return [res, null];
}

/* now we can request like this now
const [res, error] = await axiosRequestWrapper({
  callback: () => {
    return { data: "hello" };
  },
  parameters: [],
});

if (error === null) {
  console.log("got res", res.data);
} else {
  console.log("got error :(", error);
}
*/
