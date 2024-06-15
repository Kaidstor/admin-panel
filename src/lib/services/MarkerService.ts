import { db } from "$lib/db";
import { db_markers, db_places, type IMarker } from "$lib/db/schema";
import { eq, inArray, sql } from "drizzle-orm";

export class MarkerService {
  async insertOrUpdate(marker: IMarker, t?: any) {
    const markerId = marker.id;
    // @ts-ignore
    delete marker.id;

    if (!markerId || markerId < 1) {
      return await (t || db).insert(db_markers).values(marker);
    }

    await (t || db)
      .update(db_markers)
      .set(marker)
      .where(eq(db_markers.id, markerId));
  }

  async getVenueMarkers(venueId: number): Promise<{ [k: number]: number[] }> {
    const places = await db
      .select()
      .from(db_places)
      .where(eq(db_places.venue_id, venueId));

    console.log(places);

    if (places.length === 0) {
      return {};
    }

    const result = {} as { [k: number]: number[] };

    const info = await db
      .select({
        panorama_id: db_markers.panorama_id,
        markers_ids: sql<number[]>`array_agg(id)`,
      })
      .from(db_markers)
      .where(
        inArray(
          db_markers.place_id,
          places.map((p) => p.id)
        )
      )
      .groupBy(db_markers.panorama_id);

    for (const item of info) {
      result[item.panorama_id] = item.markers_ids;
    }

    return result;
  }
}

export default new MarkerService();
