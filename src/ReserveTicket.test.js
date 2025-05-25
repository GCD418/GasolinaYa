import Usuario from "./Usuario";
import ModGasolineras from "./ModGasolineras.js";
import ModUsuarios from "./ModUsuarios.js";
import Gasolinera from "./Gasolinera.js";
import { reserveTicket } from "./ReserveTicket.js";


describe("SP2.6 - Reservar Ticket", () => {
  it("Debe permitir la reserva si el usuario no tiene ticket", () => {
    const user = new Usuario("AAA111", null, null);
    const canReserve = user.getConTicket() === null;
    expect(canReserve).toBe(true);
  });


  it("Deberían devolverse las gasolineras disponibles si el usuario no tiene ticket", async () => {
    const user = new Usuario("ZZZ999", null, null);
  
    const modGasolineras = new ModGasolineras();
    modGasolineras.gasolineras.clear();
  
    await modGasolineras.addGasolinera(new Gasolinera(300, 1000, "Norte", 2));
    await modGasolineras.addGasolinera(new Gasolinera(800, 1000, "Sur", 1));
  
    const available = user.getConTicket() === null
      ? Array.from(modGasolineras.getGasolineras().values()).map(g => g.getName())
      : [];
  
    expect(available).toContain("Norte");
    expect(available).toContain("Sur");
    expect(available.length).toBe(2);
  });


  it("Debería reservar un ticket para un usuario e incrementar la cola de la estación", async () => {
    const modUsuarios = new ModUsuarios();
    const modGasolineras = new ModGasolineras();
    modUsuarios.usuarios.clear();
    modGasolineras.gasolineras.clear();
  
    const user = new Usuario("ABC123", null, null);
    await modUsuarios.addUsuario(user);
  
    const station = new Gasolinera(500, 1000, "Estación Central", 2);
    await modGasolineras.addGasolinera(station);
  
    await reserveTicket("ABC123", "Estación Central", modUsuarios, modGasolineras);
  
    const updatedUser = modUsuarios.getUsuario("ABC123");
    const updatedStation = modGasolineras.getGasolinera("Estación Central");
  
    expect(updatedUser.getConTicket()).toBe("Estación Central");
    expect(updatedStation.getQueueCount()).toBe(1);
  });
});
