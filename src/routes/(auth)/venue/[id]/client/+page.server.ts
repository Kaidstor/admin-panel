import { db } from "$lib";
import {
  db_reservations,
  db_venues,
  place_types_values,
} from "$lib/db/schema.js";
import PanoramaService from "$lib/services/PanoramaService.js";
import { error, type Actions } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import ReservationService from "$lib/services/ReservationService";
import { datediff } from "$lib/utils.js";

export const load = async (event) => {
  const { params } = event;

  const [venue] = await db
    .select()
    .from(db_venues)
    .where(and(eq(db_venues.id, +params.id)));

  if (!venue) {
    return error(404, "venue not found");
  }

  const panoramas = await PanoramaService.getVenuePanoramaClient(venue.id);

  return {
    venueId: params.id,
    panoramas,
    placeTypes: place_types_values,
  };
};

export const actions = {
  reserve: async (event) => {
    const { locals, params } = event;

    if (!locals.user) throw error(401, "unauthorized");

    const data = await event.request.json();

    const placeReserves = await ReservationService.placeReserves(data.place_id);

    const start_time = new Date(data.start_time);
    if (isNaN(start_time.getTime())) return error(400, "Invalid date");

    const minutes = start_time.getMinutes();

    if (minutes % 15 !== 0) {
      return error(400, "Не верно указано время");
    }

    if (
      placeReserves.some(
        (reserve) => Math.abs(datediff(start_time, reserve.start_time)) < 60 * 2
      )
    ) {
      return error(400, "Не удалось зарезервировать место, время занято");
    }

    await db.insert(db_reservations).values({
      user_id: locals.user.id,
      place_id: data.place_id,
      start_time: start_time,
    });

    return { ok: true, placeReserves };
  },
} satisfies Actions;

export type sitsInfo = {
  id: number;
  yaw: number;
  pitch: number;
  type: string;
  file: string;
  data: {
    panoramaId: string;
    placeType: string;
  };
};
