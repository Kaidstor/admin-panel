import { db } from '$lib';
import { db_user_heads, db_users, place_types_values } from '$lib/db/schema.js';
import { eq, inArray } from 'drizzle-orm';

export const load = async ({ params, locals }) => {
   const workers = (await db.select()
      .from(db_users)
      .where(inArray(
         db_users.id,
         db.select({ id: db_user_heads.id }).from(db_user_heads).where(eq(db_user_heads.head_id, locals.user.id))
      ))).map(worker => {
         return {
            value: worker.id.toString(),
            label: worker.name
         }
      })

   return {
      venueId: params.id,
      workers, 
      placeTypes: place_types_values
   }
}