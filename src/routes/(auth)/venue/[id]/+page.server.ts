import { db } from "$lib";
import { db_venues, db_user_heads, db_users } from "$lib/db/schema.js";
import ReservationService from "$lib/services/ReservationService.js";
import { error } from "@sveltejs/kit";
import { and, eq, inArray } from "drizzle-orm";

export const load = async (event) => {
  const { params, locals } = event;
  const workers = (
    await db
      .select()
      .from(db_users)
      .where(
        inArray(
          db_users.id,
          db
            .select({ id: db_user_heads.id })
            .from(db_user_heads)
            .where(eq(db_user_heads.head_id, locals.user.id))
        )
      )
  ).map((worker) => {
    return {
      value: worker.id.toString(),
      label: worker.name,
    };
  });

  const [venue] = await db
    .select()
    .from(db_venues)
    .where(
      and(
        eq(db_venues.owner_id, event.locals.user.id),
        eq(db_venues.id, +params.id)
      )
    );

  if (!venue) {
    return error(404, "venue not found");
  }

  const reserves = await ReservationService.getVenueReservations(venue.id);
  const places = await ReservationService.getPlaces(venue.id);

  console.log(reserves);

  return {
    venue,
    places,
    workers,
    reserves,
  };
};
