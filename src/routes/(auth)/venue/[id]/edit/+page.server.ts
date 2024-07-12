import { db } from "$lib";
import {
  db_venues,
  place_types_values,
  db_panoramas,
  type IMarker,
  db_markers,
} from "$lib/db/schema.js";
import PanoramaService, {
  type IPanorama,
} from "$lib/services/PanoramaService.js";
import { error, type Actions } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import path from "path";
import fs from "fs";
import MarkerService from "$lib/services/MarkerService.js";
import PlaceSerive from "$lib/services/PlaceSerive.js";

export const load = async (event) => {
  const { params, locals } = event;
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

  const panoramas = await PanoramaService.getVenuePanoramas(venue.id);

  return {
    venue,
    panoramas,
    placeTypes: place_types_values,
  };
};

export const actions = {
  newPanorama: async (event): Promise<IPanorama & { message: string }> => {
    const { locals, params } = event;

    if (!locals.user) throw error(401, "unauthorized");

    const [venue] = await db
      .select()
      .from(db_venues)
      .where(eq(db_venues.id, +params.id!));

    if (!venue) {
      throw error(404, "venue not found");
    }

    const form = await event.request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      throw error(400, "Некорректные данные файла");
    }

    const location = `/venues/${params.id}/${file.name}`;
    const uploadDir = path.resolve(`static/venues/${params.id}`);

    try {
      await fs.promises.mkdir(uploadDir, { recursive: true });
    } catch (e: any) {
      console.log(e);
      return e.message;
    }

    const uploadPath = path.join(uploadDir, file.name);

    const buffer = await file.arrayBuffer();
    await fs.promises.writeFile(uploadPath, Buffer.from(buffer));

    const [panorama] = await db
      .insert(db_panoramas)
      .values({
        venue_id: +params.id!,
        image: location,
      })
      .returning({ id: db_panoramas.id, image: db_panoramas.image });

    return { ...panorama, markers: [], message: "Добавлена панорама" };
  },
  removePanorama: async (event) => {
    const { locals, params } = event;

    if (!locals.user) throw error(401, "unauthorized");

    const { user } = locals;

    const [venue] = await db
      .select()
      .from(db_venues)
      .where(eq(db_venues.id, +params.id!));

    if (!venue) {
      throw error(404, "venue not found");
    }

    const { id } = (await event.request.json()) as { id: number };

    const [panorama] = await db
      .delete(db_panoramas)
      .where(eq(db_panoramas.id, id))
      .returning();

    return { panorama };
  },
  save: async (event) => {
    const { locals, params } = event;

    if (!locals.user) throw error(401, "unauthorized");

    const venueId = +params.id!;
    const panoramas = (await event.request.json()) as IPanorama[];

    const venue_markers = await MarkerService.getVenueMarkers(venueId);

    console.log(venue_markers);

    for (const panorama of panoramas) {
      for (const marker of panorama.markers) {
        const m = {
          id: marker.id,
          title: marker.place?.name,
          place_id: marker.place?.id,
          panorama_id: marker.panorama_id,
          transition_panorama_id: marker.transition_panorama_id,
          type: marker.type,
          yaw: marker.yaw,
          pitch: marker.pitch,
        } as IMarker;

        await db.transaction(async (t) => {
          try {
            if (marker.place) {
              marker.place.venue_id = venueId;
              const [{ id }] = await PlaceSerive.insertOrUpdate(
                marker.place,
                t
              );
              m.place_id = id;
            } else {
              m.place_id = null;
            }

            await MarkerService.insertOrUpdate(m, t);
          } catch (e: any) {
            console.log(e);
            t.rollback();
            return e.message;
          }
        });
      }

      const prev_markers_ids = venue_markers[panorama.id] || [];
      const new_markers_ids = panorama.markers.map((m) => m.id);

      console.log(prev_markers_ids, new_markers_ids);

      if (prev_markers_ids.length != new_markers_ids.length) {
        for (const id of prev_markers_ids) {
          if (!new_markers_ids.includes(+id)) {
            console.log("delete marker", id);
            await db.delete(db_markers).where(eq(db_markers.id, id));
          }
        }
      }
    }

    return { data: panoramas, message: "Панорама успешно сохранена" };
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
