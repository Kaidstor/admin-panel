import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";
import { DATABASE_URL } from "$env/static/private";

import pkg from "pg";
const { Client } = pkg;

const client = new Client({
  connectionString: DATABASE_URL,
});

client.connect(() => console.log("connected to db", DATABASE_URL));

export const db = drizzle(client, { schema });
