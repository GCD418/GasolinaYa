import { getPlacasEnFila, removeFromQueue } from "./GestionColas";  
import ModUsuarios from "./ModUsuarios";
import Usuario from "./Usuario";


describe("Gestión de colas - SP2.5", () => {
  it("debería retornar placas en fila para una gasolinera específica", async () => {
    const modUsuarios = new ModUsuarios();
    modUsuarios.usuarios.clear();

    const u1 = new Usuario("AAA111", "El Cristo");
    const u2 = new Usuario("BBB222", "El Cristo");
    const u3 = new Usuario("CCC333", "Asunción");
    const u4 = new Usuario("DDD444", null);

    await modUsuarios.addUsuario(u1);
    await modUsuarios.addUsuario(u2);
    await modUsuarios.addUsuario(u3);
    await modUsuarios.addUsuario(u4);

    const resultadoCristo = getPlacasEnFila("El Cristo", modUsuarios);
    const resultadoManantial = getPlacasEnFila("Asunción", modUsuarios);
    const resultadoVacio = getPlacasEnFila("NoExiste", modUsuarios);

    expect(resultadoCristo).toEqual(["AAA111", "BBB222"]);
    expect(resultadoManantial).toEqual(["CCC333"]);
    expect(resultadoVacio).toEqual([]);
  });
});

describe("Gestión de colas - SP2.5", () => {
    it("debería eliminar la placa de la fila", async () => {
      const modUsuarios = new ModUsuarios();
      modUsuarios.usuarios.clear();
  
      const u1 = new Usuario("AAA111", "El Cristo");
      await modUsuarios.addUsuario(u1);
  
      expect(modUsuarios.getUsuario("AAA111").getEnFila()).toBe("El Cristo");
  
      await removeFromQueue("AAA111", "El Cristo", modUsuarios);
  
      expect(modUsuarios.getUsuario("AAA111").getEnFila()).toBe(null);
    });
  });

  it("debería llamar a decrementQueueCount al remover de la fila", async () => {
    const modUsuarios = new ModUsuarios();
    modUsuarios.usuarios.clear();
  
    const mockGasolineras = {
      decrementQueueCount: jest.fn().mockResolvedValue(true)
    };
  
    const u1 = new Usuario("BBB222", "El Cristo");
    await modUsuarios.addUsuario(u1);
  
    await removeFromQueue("BBB222", "El Cristo", modUsuarios, mockGasolineras);
  
    expect(mockGasolineras.decrementQueueCount).toHaveBeenCalledWith("El Cristo");
  });
  