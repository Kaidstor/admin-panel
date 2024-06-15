import { redirect, type Handle } from "@sveltejs/kit";
import { verifyAuthJWT } from "$lib/jwt";

const authUrls = [
  "/notifications",
  "/payment",
  "/profile",
  "/stats",
  "/tariff",
  "/venue",
  "/worker",
];

export const handle: Handle = async ({ event, resolve }) => {
  const user = await verifyAuthJWT(event);
  const url = new URL(event.request.url);

  if (user) {
    event.locals.user = user;
  } else if (
    url.pathname == "/" ||
    authUrls.some((authUrl) => url.pathname.startsWith(authUrl))
  ) {
    throw redirect(302, "/login");
  }

  return await resolve(event);
};
