import { s_fetch } from ".";

export const reservePlace = (place_id: number, start_time: Date) => {
  s_fetch("?/reserve", { body: { place_id, start_time } });
};
