import ReservationService from "../../../lib/services/ReservationService";

export const load = async (event) => {
  const { locals } = event;

  const reserves = await ReservationService.getReservations(locals.user.id);
  const places = await ReservationService.getPlaces();

  console.log(reserves);

  return {
    reserves,
    places,
  };
};
