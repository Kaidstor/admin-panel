import { db } from "$lib/db";
import { db_places, db_reservations, db_users } from "$lib/db/schema";
import { and, eq, gte, inArray, sql } from "drizzle-orm";
import { number } from "zod";

export class ReservationService {
  async placeReserves(place_id: number, condition?: any) {
    return await db
      .select()
      .from(db_reservations)
      .where(
        and(
          eq(db_reservations.place_id, place_id),
          gte(db_reservations.start_time, sql`NOW() - '1 day'::interval`)
        )
      );
  }

  async getReservations(user_id: number) {
    return await db
      .select({
        id: db_reservations.id,
        user: {
          id: db_users.id,
          name: db_users.name,
          email: db_users.email,
        },
        place: {
          id: db_places.id,
          type: db_places.type,
        },
        start_time: sql<string>`${db_reservations.start_time}::text`,
      })
      .from(db_reservations)
      .where(eq(db_reservations.user_id, user_id))
      .orderBy(db_reservations.start_time)
      .leftJoin(db_users, eq(db_users.id, db_reservations.user_id))
      .leftJoin(db_places, eq(db_places.id, db_reservations.place_id));
  }

  async getPlaces() {
    return await db.select().from(db_places);
  }
}

export default new ReservationService();
