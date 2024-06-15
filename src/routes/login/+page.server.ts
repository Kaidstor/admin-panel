import { db } from "$lib";
import { db_users } from "$lib/db/schema";
import { createAuthJWT } from "$lib/jwt";
import { compare, hash } from "$lib/server/utils";
import { fail, type Actions, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import * as z from "zod";
import type { PageServerLoad } from "./$types";
import { isValidResult, superValidate } from "$lib/services/FormService";

export const load: PageServerLoad = async (event) => {
  return {
    loginForm: await superValidate(event, loginFormSchema),
    registrationForm: await superValidate(event, registrationFormSchema),
  };
};

export const actions = {
  login: async (event) => {
    console.log("validate");
    const form = await superValidate(event, loginFormSchema);
    console.log("not valid");

    if (!isValidResult(form)) return fail(400, form.errors);

    console.log("validate");
    const { password, email } = form.data;

    console.log(form.data);

    const [user] = await db
      .select()
      .from(db_users)
      .where(eq(db_users.email, email));

    console.log("validate");
    if (!user) {
      return fail(400, { email: "Не верно указан email" });
    }

    console.log("validate");
    const isCorrectPassword = await compare(password, user.password);

    console.log("validate");
    if (!isCorrectPassword) {
      return fail(400, { password: "Неправильный пароль" });
    }

    console.log("validate");
    const token = await createAuthJWT({
      id: user.id,
      name: user.name,
      role: user.role,
    });

    console.log("validate");
    event.cookies.set("token", token, { path: "/" });

    console.log("validate");
    return redirect(302, "/");
  },
  registration: async (event) => {
    const form = await superValidate(event, registrationFormSchema);

    if (!isValidResult(form)) return fail(400, form.errors);

    const { email, password, confirm_password } = form.data;

    const [isCreated] = await db
      .select()
      .from(db_users)
      .where(eq(db_users.email, email));
    if (isCreated)
      return fail(400, { email: "Пользователь уже зарегестрирован" });

    if (password !== confirm_password) {
      return fail(400, { confirm_password: "Пароли не совпадают" });
    }

    const password_hash = await hash(password);

    if (!password_hash) return fail(500, { password: "<PASSWORD>" });

    const [user] = await db
      .insert(db_users)
      .values({
        name: email,
        email: email,
        password: password_hash,
        role: "client",
      })
      .returning();

    const token = await createAuthJWT({
      id: user.id,
      name: user.name,
      role: user.role,
    });

    event.cookies.set("token", token, { path: "/" });

    return redirect(302, "/");
  },
} satisfies Actions;

const loginFormSchema = z.object({
  email: z.string().min(2, { message: "Слишком короткий логин" }).max(50),
  password: z.string().min(2, { message: "Слишком короткий пароль" }).max(50),
});

const registrationFormSchema = z.object({
  email: z.string().min(2, { message: "Слишком короткий логин" }).max(50),
  password: z.string().min(2, { message: "Слишком короткий пароль" }).max(50),
  confirm_password: z
    .string()
    .min(2, { message: "Слишком короткий пароль" })
    .max(50),
});
