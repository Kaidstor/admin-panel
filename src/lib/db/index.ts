import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './schema';
import { env } from '$env/dynamic/private';

import pkg from "pg";
const { Client } = pkg;

const client = new Client({
   connectionString: env.DATABASE_URL
})

client.connect(() => console.log('connected to db'))

export const db = drizzle(client, { schema }) 