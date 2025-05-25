import { getAvailableStations, getReservationMessage } from "./ReserveTicket";

describe("Reserva de Tickets", () => {
    it("Debe devolver todas las estaciones disponibles cuando el usuario no tiene ningún Ticket reservado", () => {
        const user = { plate: "ABC123", ticket: null };
        const stations = ["Cristo", "Asunción", "Manantial"];
    
        expect(getAvailableStations(user, stations)).toEqual(stations);
      });

  it("Debe devolver un mensaje si el usuario ya tiene un ticket reservado.", () => {
    const user = {
      plate: "XYZ789",
      ticket: { station: "Asunción", hour: "10:00" },
    };

    const msg = getReservationMessage(user);
    expect(msg).toBe(
      "Ya tienes un ticket reservado para la estación Asunción a las 10:00."
    );
  });
  

  it("Debe devolver una lista vacía si el usuario ya tiene un ticket reservado", () => {
    const user = {
      plate: "DEF456",
      ticket: { station: "Cristo", hour: "09:30" },
    };
    const stations = ["Cristo", "Asunción", "Manantial"];
  
    expect(getAvailableStations(user, stations)).toEqual([]);
  });
  
  it("Debe devolver un mensaje si el usuario no tiene ningún ticket reservado", () => {
    const user = {
      plate: "LMN000",
      ticket: null,
    };
  
    const msg = getReservationMessage(user);
    expect(msg).toBe("No tienes ningún ticket reservado.");
  });
  
});