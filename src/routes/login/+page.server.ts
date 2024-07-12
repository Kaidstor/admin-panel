import { db } from "$lib";
import { db_users } from "$lib/db/schema";
import { createAuthJWT } from "$lib/jwt";
import { compare, hash } from "$lib/server/utils";
import { fail, type Actions, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import {
  loginFormSchema,
  registrationFormCodeSchema,
  registrationFormSchema,
} from "$lib/zod/shemas";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import NotifyService from "$lib/services/NotifyService";

function genCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

const mails = new Map<string, string>();

export const load: PageServerLoad = async (event) => {
  return {
    loginForm: await superValidate(zod(loginFormSchema)),
    registrationForm: await superValidate(zod(registrationFormSchema)),
  };
};

export const actions = {
  login: async (event) => {
    const form = await superValidate(event.request, zod(loginFormSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { password, email } = form.data;

    const [user] = await db
      .select()
      .from(db_users)
      .where(eq(db_users.email, email));

    if (!user) {
      return message(form, "Не верно указан email, телефон или пароль", {
        status: 400,
      });
    }

    const isCorrectPassword = await compare(password, user.password);

    if (!isCorrectPassword) {
      return message(form, "Не верно указан email, телефон или пароль", {
        status: 400,
      });
    }

    const token = await createAuthJWT({
      id: user.id,
      name: user.name || "Noname",
      role: user.role,
    });

    event.cookies.set("token", token, { path: "/" });
    return redirect(302, "/");
  },

  registration: async (event) => {
    const form = await superValidate(
      event.request,
      zod(registrationFormSchema)
    );

    if (!form.valid) {
      return fail(400, { form });
    }

    const { email } = form.data;

    try {
      const [isCreated] = await db
        .select()
        .from(db_users)
        .where(eq(db_users.email, email));

      if (isCreated) {
        return message(form, "Данная почта зарегистрирована в системе", {
          status: 400,
        });
      }
    } catch (e) {
      console.log(e);
      return fail(400, { form });
    }

    let code: string;
    while (true) {
      code = genCode().toString();
      const isExist = mails.has(code);

      if (!isExist) {
        mails.set(code, email);
        break;
      }
    }

    try {
      await NotifyService.send({
        to: email,
        subject: "Регистрация в системе",
        text: `${code}, код будет временным паролем, его можно будет изменить после входа в систему`,
      });

      return message(form, "Почтовое уведомление успешно отправлено");
    } catch (e) {
      console.log(e);
      return message(form, "Не удалось отправить почтовое уведомление", {
        status: 400,
      });
    }
  },

  registration_code: async (event) => {
    const data = await event.request.json(); // Получение данных из запроса
    const result = registrationFormCodeSchema.safeParse(data);

    if (!result.success) {
      return fail(400, { message: "Не верно указан код" });
    }

    const header_phone = event.request.headers.get("x-email");
    const { code } = data;

    const email = mails.get(code);

    if (header_phone !== email) {
      return fail(400, { message: "Не верно указан код" });
    }

    const password = await hash(code);

    if (!password) {
      return fail(400, { message: "Не удалось создать пароль" });
    }

    const [user] = await db
      .insert(db_users)
      .values({
        name: "Noname",
        email,
        password,
        role: "client",
      })
      .returning();

    const token = await createAuthJWT({
      id: user.id,
      name: user.name || "Noname",
      role: user.role,
    });

    event.cookies.set("token", token, { path: "/" });

    return redirect(302, "/");
  },
} satisfies Actions;
