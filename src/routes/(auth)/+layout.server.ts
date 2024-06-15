import { db, db_users } from "$lib";
import { redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const load = async ({ locals }) => {
  if (!locals.user) throw redirect(302, "/login");

  const [user] = await db
    .select()
    .from(db_users)
    .where(eq(db_users.id, locals.user!.id));

  const { password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
  };
};
