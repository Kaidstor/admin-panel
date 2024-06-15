import {
  db,
  db_markers,
  db_panoramas,
  db_places,
  db_reservations,
  type IMarkerWithPlace,
} from "$lib";
import { eq, inArray, sql } from "drizzle-orm";

class PanoramaService {
  async getVenuePanoramas(id: number): Promise<IPanorama[]> {
    const panoramas = await db
      .select({ id: db_panoramas.id, image: db_panoramas.image })
      .from(db_panoramas)
      .where(eq(db_panoramas.venue_id, id));

    if (panoramas.length === 0) {
      return [];
    }

    const places = await db
      .select()
      .from(db_places)
      .where(eq(db_places.venue_id, id));

    const markers = (await db
      .select()
      .from(db_markers)
      .where(
        inArray(
          db_markers.panorama_id,
          panoramas.map((p) => p.id)
        )
      )) as IMarkerWithPlace[];

    const markersByPlaceId = markers.reduce((acc, marker) => {
      if (!acc[marker.panorama_id]) {
        acc[marker.panorama_id] = [];
      }

      marker.place = places.filter(
        (p) => p.id === marker.place_id
      )[0];

      acc[marker.panorama_id].push(marker);
      return acc;
    }, {} as Record<number, IMarkerWithPlace[]>);

    return panoramas.map((panorama) => ({
      ...panorama,
      markers: markersByPlaceId[panorama.id] || [],
    }));
  }

  async getVenuePanoramaClient(id: number): Promise<IPanorama[]> {
    const venuePanoramas = await this.getVenuePanoramas(id);

    const place_ids = venuePanoramas
      .map((panorama) => panorama.markers.map((marker) => marker.place_id!))
      .flat()
      .filter(Boolean);

    if (place_ids.length === 0) return [];

    const reservations_time_grouped = db
      .select({
        place_id: db_reservations.place_id,
        date: sql<Date>`start_time::date`.as("date"),
        reserved_time: sql<{ [k: string]: Date[] }[]>`array_agg(start_time)`.as(
          "reserved_time"
        ),
      })
      .from(db_reservations)
      .where(inArray(db_reservations.place_id, place_ids))
      .groupBy(db_reservations.place_id, sql`date`)
      .as("reservations_time_grouped");

    const places_reservations_time_raw = await db
      .select({
        place_id: reservations_time_grouped.place_id,
        dates: sql`json_object_agg(reservations_time_grouped.date, reservations_time_grouped.reserved_time)`,
      })
      .from(reservations_time_grouped)
      .groupBy(
        reservations_time_grouped.place_id,
        reservations_time_grouped.date,
        reservations_time_grouped.reserved_time
      );

    const places_reservations_time = {} as {
      [k: number]: { [k: string]: Date[] };
    };


    for (const places_reservation of places_reservations_time_raw) {
      places_reservations_time[places_reservation.place_id] =
        places_reservation.dates as any;
    }

    const result = venuePanoramas.map((panorama) => ({
      ...panorama,
      markers: panorama.markers.map((marker) => {
        if (marker.type == "place") {
          // @ts-ignore
          delete marker.transition_panorama_id;

          // console.log(marker)

          console.log(places_reservations_time);
          console.log(places_reservations_time[marker.place!.id]);

          marker.place!.reservation_time =
            places_reservations_time[marker.place.id];

          return marker;
        }

        delete marker.place;
        return marker;
      }),
    }));

    return result;
  }
}

export interface IPanorama {
  id: number;
  image?: string;
  markers: IMarkerWithPlace[];
}

export default new PanoramaService();
