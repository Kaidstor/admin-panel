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

export const loginFormSchema = z.object({
  email: z.string().min(2, { message: "Слишком короткий логин" }).max(50),
  password: z.string().min(2, { message: "Слишком короткий пароль" }).max(50),
});

export const registrationFormSchema = z.object({
  email: z
    .string()
    .email("Не верно указан email")
    .min(2, { message: "Слишком короткий логин" })
    .max(50),
});

export const registrationFormCodeSchema = z.object({
  code: z
    .string()
    .length(6, { message: "Код должен состоять из 6 цифр" })
    .regex(/^\d+$/, { message: "Код должен содержать только цифры" }),
});

export const createVenueFormSchema = z.object({
  name: z.string().max(30).min(1),
  address: z.string().min(5).max(30),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Минимальная длина имени 1 символ" })
    .max(20, { message: "Максимальная длина имени 20" }),
  // email: z.string().email({ message: 'Не верно указан email' }),
});
