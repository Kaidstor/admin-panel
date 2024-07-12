import { goto } from "$app/navigation";
import { toast } from "svelte-sonner";
import type { FormOptions } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { ZodObject } from "zod";

interface FunctionArgs {
  schema: ZodObject<any>;
  callback?: () => void;
  [key: string]: any; // Используем тип any для обобщения, потом уточним
}

type ExtendedFunctionArgs = FunctionArgs & {
  [K in keyof FormOptions]?: FormOptions[K];
};

export const defaultFormOptions = ({
  schema,
  callback,
}: ExtendedFunctionArgs) =>
  ({
    onSubmit: ({ validators }) => {
      validators(zod(schema));
    },
    onResult: ({ result }) => {
      if (result.type == "error") {
        return toast.error(result.error.message);
      }

      if (result.type == "redirect") {
        return goto(result.location);
      }

      const form = result.data?.form;

      if (!form) return;

      if (result.type == "success") {
        toast.success(form.message);

        callback?.();
      } else {
        toast.error(form.message);
      }
    },
    resetForm: false,
  } as FormOptions);
