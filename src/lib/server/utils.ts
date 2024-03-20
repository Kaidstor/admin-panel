import type { JWTPayload } from '$lib/jwt'
import { redirect, type RequestEvent, type ServerLoadEvent } from '@sveltejs/kit'
import bcrypt from 'bcrypt'

export async function hash(password: string): Promise<string | undefined> {
   return new Promise((resolve) => bcrypt.hash(password, 10, (err, hash) => {
      resolve(err ? undefined : hash)
   }))
}

export function compare(password: string, storedHash: string): Promise<boolean> {
   return new Promise((resolve) => bcrypt.compare(password, storedHash, (err, result) => resolve((err || !result) ? false : true)))
}

export const isLocalAuth = <T>(event: ServerLoadEvent | RequestEvent): { auth: JWTPayload, params: T } => {
   {
      const { locals: { user }, params } = event

      if (event.locals?.user)
         return { auth: user!, params: params as T }

      throw redirect(302, '/login')
   }
}