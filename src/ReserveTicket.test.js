import Usuario from "./Usuario";

describe("SP2.6 - Reservar Ticket", () => {
  it("Debe permitir la reserva si el usuario no tiene ticket", () => {
    const user = new Usuario("AAA111", null, null);
    const canReserve = user.getConTicket() === null;
    expect(canReserve).toBe(true);
  });
});
