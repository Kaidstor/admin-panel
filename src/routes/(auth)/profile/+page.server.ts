import { error, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { isValidResult, superValidate } from "$lib/services/FormService";
import { z } from "zod";
import { db, db_users } from "$lib";
import { eq } from "drizzle-orm";

export const load: PageServerLoad = async (event) => {
   const { locals: { user } } = event;

   if (!user) {
      throw redirect(302, '/login');
   }

   const updateProfileForm = await superValidate(event, updateProfileSchema);

   return {
      updateProfileForm
   }
}

export const actions = {
   updateProfile: async (event) => {
      const { locals } = event;

      if (!locals.user)
         throw error(401, 'unauthorized');

      const { user: auth } = locals

      const form = await superValidate(event, updateProfileSchema);

      if (!isValidResult(form))
         return fail(400, form.errors);

      const { name } = form.data

      try {
         const [user] = await db.update(db_users).set({
            name
         }).where(eq(db_users.id, auth.id)).returning();

         locals.user.name = user.name;

         return { invalidate: true, user };
      }
      catch (e) {
         return fail(400, { email: "Пользователь с данным email уже зарегестрирован" });
      }
   }
}


const updateProfileSchema = z.object({
   name: z.string().min(2, { message: 'Минимальная длина имени 1 символ' }).max(20, { message: 'Максимальная длина имени 20' }),
   // email: z.string().email({ message: 'Не верно указан email' }),
})