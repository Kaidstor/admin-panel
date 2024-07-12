import { deserialize } from "$app/forms";
import { goto, invalidateAll } from "$app/navigation";
import { toast } from "svelte-sonner";

export const s_fetch = async <T>(
  url: string,
  options?: {
    body?: FormData | string | Record<string, any>;
    method?: "POST" | "GET";
    headers?: Record<string, string>;
    invalidateAll?: boolean;
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

    const result = deserialize(await response.text());

    const { data, type, location } = result as {
      data: T;
      location?: string;
      type: "success" | "failure" | "redirect";
      status: number;
    };

    const { message }: { message?: string } = data || {};

    if (type == "redirect") {
      goto(location!);
    }

    if (type == "success") {
      options?.invalidateAll && invalidateAll();
      message && toast.success(message as string);
    }

    if (type == "failure" && typeof message == "string") {
      toast.error(message);
    }

    return result as { type: string; status: number; data: T };
  } catch (e: any) {
    console.log(e?.message || e);
  }
};
