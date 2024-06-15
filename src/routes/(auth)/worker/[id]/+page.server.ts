import type { PageServerLoad, RouteParams } from "./$types";
import { isLocalAuth } from "$lib/server/utils";
import { db, db_user_heads, db_users } from "$lib";
import { and, eq } from "drizzle-orm";
import { error, fail } from "@sveltejs/kit";
import { z } from "zod";
import { isValidResult, superValidate } from "$lib/services/FormService";

export const load: PageServerLoad = async (event) => {
  const { params, auth } = isLocalAuth<RouteParams>(event);

  const [user] = await db
    .select({
      head_id: db_user_heads.head_id,
      avatar: db_users.avatar,
      name: db_users.name,
      email: db_users.email,
    })
    .from(db_users)
    .leftJoin(db_user_heads, eq(db_user_heads.id, db_users.id))
    .where(and(eq(db_users.id, +params.id)));

  if (!user) {
    throw error(404, "Пользователь не найден");
  }

  if (user.head_id != auth.id) {
    throw error(404, "У вас нет доступа для просмотра данного профиля");
  }

  const updateWorkerForm = await superValidate(event, updateWorkerSchema);

  return { user, updateWorkerForm };
};

export const actions = {
  updateWorkerProfile: async (event) => {
    const { params, auth } = isLocalAuth<RouteParams>(event);

    const [user] = await db
      .select()
      .from(db_user_heads)
      .where(eq(db_user_heads.id, +params.id));

    if (!user) {
      return error(400, "Пользователь не найден!");
    }

    if (user.head_id != auth.id) {
      return error(400, "У вас нет доступа для просмотра данного профиля");
    }

    const form = await superValidate(event, updateWorkerSchema);

    if (!isValidResult(form)) return fail(400, form.errors);

    const { name } = form.data;

    const updated_user = await db
      .update(db_users)
      .set({ name })
      .where(eq(db_users.id, +params.id))
      .returning();

    return { updated_user };
  },
};

const updateWorkerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Минимальная длина имени 2 символа" })
    .max(20, { message: "Максимальная длина имени 20 символов" }),
});
