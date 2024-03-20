import { db } from "$lib";
import { db_posts, db_user_heads, db_users, type User } from "$lib/db/schema";
import { isValidResult, superValidate } from "$lib/services/FormService.js";
import { redirect, type Actions, fail, error } from "@sveltejs/kit";
import { eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
   const { locals } = event;
   const user = locals.user!

   const [{ id: subordinates }] = await db.select({ id: sql<number[]>`COALESCE(json_agg(id), '[]')` }).from(db_user_heads).where(eq(db_user_heads.head_id, user.id));

   let workers = [] as User[]

   if (subordinates.length) {
      workers = await db.select().from(db_users).where(inArray(db_users.id, subordinates));
   }

   const createWorkerForm = await superValidate(event, createWorkerFormSchema);
   const venues = await db.select({
      value: sql<string>`${db_posts.id}::text`,
      label: db_posts.name
   }).from(db_posts).where(eq(db_posts.owner_id, user.id))

   return { workers, venues, user, createWorkerForm }
}

export const actions = {
   createWorker: async (event) => {
      const { locals } = event
      
      if (!locals.user)
         throw error(401, 'unauthorized');

      const { user: auth } = locals

      const form = await superValidate(event, createWorkerFormSchema);

      if (!isValidResult(form))
         return fail(400, form.errors);

      const { name, email } = form.data

      try {
         const user = await db.transaction(async t => {
            const [user] = await t.insert(db_users).values({
               name, email, password: 'password', role: 'hostess'
            }).returning();
   
            await t.insert(db_user_heads).values({
               head_id: auth.id,
               id: user.id
            })
   
            return user
         })
         return { success: true, user };
      }
      catch (e) {
         return fail(400, {email: "Пользователь с данным email уже зарегестрирован"});
      }
   }
} satisfies Actions;

const createWorkerFormSchema = z.object({
   name: z.string().min(2, {message: 'Минимальная длина имени 1 символ'}).max(20, {message: 'Максимальная длина имени 20'}),
   email: z.string().email({ message: 'Не верно указан email' }),
   venueId: z.number().optional().transform(value => value ?? null),
})