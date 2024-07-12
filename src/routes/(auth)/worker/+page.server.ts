import { db } from "$lib";
import { db_venues, db_user_heads, db_users, type IUser } from "$lib/db/schema";
import { type Actions, fail, error } from "@sveltejs/kit";
import { eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";
import { createWorkerFormSchema } from "$lib/zod/shemas";

export const load: PageServerLoad = async (event) => {
  const { locals } = event;
  const user = locals.user!;

  const [{ id: subordinates }] = await db
    .select({ id: sql<number[]>`COALESCE(json_agg(id), '[]')` })
    .from(db_user_heads)
    .where(eq(db_user_heads.head_id, user.id));

  let workers = [] as IUser[];

  if (subordinates.length) {
    workers = await db
      .select()
      .from(db_users)
      .where(inArray(db_users.id, subordinates));
  }

  const addWorkerForm = await superValidate(zod(createWorkerFormSchema));

  const venues = await db
    .select({
      value: sql<string>`${db_venues.id}::text`,
      label: db_venues.name,
    })
    .from(db_venues)
    .where(eq(db_venues.owner_id, user.id));

  return { workers, venues, user, addWorkerForm };
};

export const actions = {
  createWorker: async (event) => {
    const { locals } = event;

    if (!locals.user) throw error(401, "unauthorized");

    const { user: auth } = locals;

    const form = await superValidate(
      event.request,
      zod(createWorkerFormSchema)
    );

    if (!form.valid) {
      return fail(400, { form });
    }

    const { name, email } = form.data;

    try {
      await db.transaction(async (t) => {
        const [user] = await t
          .insert(db_users)
          .values({
            name,
            email,
            password: "password",
            role: "hostess",
          })
          .returning();

        await t.insert(db_user_heads).values({
          head_id: auth.id,
          id: user.id,
        });
      });

      return message(form, "Хостес успешно добавлен");
    } catch (e) {
      form.valid = false;
      form.errors.email = ["Пользователь с данным email уже зарегестрирован"];

      return fail(400, { form });
    }
  },
} satisfies Actions;
