import { db, db_users } from "$lib";
import { error, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const load = async ({ locals, cookies }) => {
  if (!locals.user) throw redirect(302, "/login");

  const [user] = await db
    .select()
    .from(db_users)
    .where(eq(db_users.id, locals.user!.id));

  if (!user) {
    cookies.delete("token", { path: "/" });
    throw redirect(302, "/login");
  }

  const { password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
  };
};
