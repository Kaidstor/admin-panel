import { error, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db, db_users } from "$lib";
import { eq } from "drizzle-orm";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { updateProfileSchema } from "$lib/zod/shemas";

export const load: PageServerLoad = async (event) => {
  const {
    locals: { user },
  } = event;

  if (!user) {
    throw redirect(302, "/login");
  }

  const [current_user] = await db
    .select()
    .from(db_users)
    .where(eq(db_users.id, user.id));

  const updateProfileForm = await superValidate(
    current_user,
    zod(updateProfileSchema)
  );

  return {
    updateProfileForm,
  };
};

export const actions = {
  updateProfile: async (event) => {
    const { locals } = event;

    if (!locals.user) throw error(401, "unauthorized");

    const { user: auth } = locals;

    const form = await superValidate(event.request, zod(updateProfileSchema));

    if (!form.valid) return fail(400, { form });

    const { name } = form.data;

    try {
      const [user] = await db
        .update(db_users)
        .set({
          name,
        })
        .where(eq(db_users.id, auth.id))
        .returning();

      locals.user.name = user.name!;

      return message(form, "Данные пользователя обновлены");
    } catch (e) {
      return message(form, "Пользователь с данным email уже зарегестрирован");
    }
  },
};
