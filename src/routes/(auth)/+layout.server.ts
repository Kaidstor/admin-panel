import { db, db_users } from '$lib';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
   const [user] = await db.select().from(db_users).where(eq(db_users.id, locals.user!.id));

   const {password, ...userWithoutPassword} = user;
   
   return {
      user: userWithoutPassword
   }
}