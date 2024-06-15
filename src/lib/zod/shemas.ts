import { z } from "zod";

export const createWorkerFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Минимальная длина имени 1 символ" })
    .max(20, { message: "Максимальная длина имени 20" }),
  email: z.string().email({ message: "Не верно указан email" }),
  venueId: z.preprocess(
    (value) => {
      return value === "undefined" || "NaN" ? undefined : value;
    },
    z
      .number()
      .optional()
      .transform((value) => value ?? null)
  ),
});
