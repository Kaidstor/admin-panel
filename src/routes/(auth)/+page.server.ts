import type { PageServerLoad } from "./$types.js";
import { error, fail, redirect } from "@sveltejs/kit";
import { db, db_venues } from "$lib";
import { eq } from "drizzle-orm";
import { createVenueFormSchema } from "$lib/zod/shemas.js";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async (event) => {
  const { locals } = event;

  if (!locals.user) throw redirect(302, "/login");

  const venues = await db
    .select()
    .from(db_venues)
    .where(eq(db_venues.owner_id, locals.user.id));

  const addVenueForm = await superValidate(zod(createVenueFormSchema));
  return { addVenueForm, venues };
};

export const actions = {
  addVenue: async (event) => {
    const { locals } = event;
    if (!locals.user) throw error(401, "unauthorized");

    const form = await superValidate(event.request, zod(createVenueFormSchema));

    if (!form.valid) {
      return message(form, {
        status: 400,
      });
    }

    const { name, address } = form.data;

    try {
      const [venue] = await db
        .insert(db_venues)
        .values({
          name,
          owner_id: locals.user.id,
          meta: { address },
        })
        .returning();

      return message(form, "Заведение добавлено");
    } catch (e) {
      return message(form, "Ошибка на сервере", {
        status: 500,
      });
    }
  },
};
