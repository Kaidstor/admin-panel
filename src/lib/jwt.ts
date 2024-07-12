import { JWT_SECRET } from "$env/static/private";
import type { RequestEvent } from "@sveltejs/kit";
import * as jose from "jose";

export type JWTPayload = {
  id: number;
  name: string;
  role: string;
};

export const createAuthJWT = async (data: JWTPayload) => {
  const jwt = await new jose.SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .sign(new TextEncoder().encode(JWT_SECRET));
  return jwt;
};

export const verifyAuthJWT = async (event: RequestEvent) => {
  try {
    const token = event.cookies.get("token");
    if (!token) return;

    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    return payload as JWTPayload;
  } catch (e) {
    return;
  }
};
