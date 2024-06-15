import { deserialize } from "$app/forms";

export const s_fetch = async <T>(
  url: string,
  options?: {
    body?: FormData | string | Record<string, any>;
    method?: "POST" | "GET";
    headers?: Record<string, string>;
  }
) => {
  try {
    const fetchOptions = {
      method: "POST",
      headers: {},
      ...options,
    };

    fetchOptions.body =
      typeof fetchOptions.body === "object" &&
      !(fetchOptions.body instanceof FormData)
        ? JSON.stringify(fetchOptions.body)
        : (fetchOptions.body as string | FormData | undefined);

    // @ts-ignore
    const response = await fetch(url, fetchOptions);

    const text = await response.text();

    return deserialize(text) as { type: string; status: number; data: T };
  } catch (e: any) {
    console.log(e?.message || e)
  }
};
