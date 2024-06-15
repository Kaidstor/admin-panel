import { db } from "$lib/db";
import { db_places, type IPlace } from "$lib/db/schema";
import { eq } from "drizzle-orm";

export class PlaceService {
  async insertOrUpdate(place: IPlace, t?: any) {
    const placeId = place.id;
    // @ts-ignore
    delete place.id;
    // @ts-ignore
    delete place.updated_at;
    // @ts-ignore
    delete place.created_at;

    if (!placeId || placeId < 1) {
      return await (t || db).insert(db_places).values(place).returning();
    }

    return await (t || db)
      .update(db_places)
      .set({ ...place, updated_at: new Date() })
      .where(eq(db_places.id, placeId))
      .returning();
  }
}

export default new PlaceService();
