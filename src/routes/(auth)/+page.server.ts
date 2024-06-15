import { isValidResult, superValidate } from "$lib/services/FormService.js";
import { z } from "zod";
import type { PageServerLoad } from "./$types.js";
import { error, fail } from "@sveltejs/kit";
import { db, db_venues } from "$lib";
import { eq } from "drizzle-orm";

export const load: PageServerLoad = async (event) => {
  const venues = await db
    .select()
    .from(db_venues)
    .where(eq(db_venues.owner_id, event.locals.user.id));

  const createVenueForm = await superValidate(event, createVenueFormSchema);
  return { createVenueForm, venues };
};

export const actions = {
  addVenue: async (event) => {
    const { locals } = event;

    if (!locals.user) throw error(401, "unauthorized");

    const { user: auth } = locals;

    const form = await superValidate(event, createVenueFormSchema);

    if (!isValidResult(form)) return fail(400, form.errors);

    const { name, address } = form.data;

    try {
      const [venue] = await db
        .insert(db_venues)
        .values({
          name,
          owner_id: auth.id,
          meta: { address },
        })
        .returning();

      return { invalidate: true, venue };
    } catch (e) {
      return fail(500, {
        email: "Ошибка на сервере",
      });
    }
  },
};

const createVenueFormSchema = z.object({
  name: z.string().max(30).min(1),
  address: z.string().min(5).max(30),
});
