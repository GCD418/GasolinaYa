import { getAvailableStations } from "./ReserveTicket";

describe("Reserva de Tickets", () => {
  it("Debe devolver todas las estaciones disponibles cuando el usuario no tiene ningún billete reservado", () => {
    const user = { plate: "ABC123", ticket: null };
    const stations = ["Cristo", "Asunción", "Manantial"];

    const result = getAvailableStations(user, stations);

    expect(result).toEqual(stations);

  });
});