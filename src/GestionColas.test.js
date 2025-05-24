import { getPlacasEnFila, removeFromQueue, confirmFuelLoad } from "./GestionColas";  
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
  
  describe("Gestión de colas - SP2.5", () => {
    it("debería eliminar la placa de la fila al confirmar carguío", async () => {
    const modUsuarios = new ModUsuarios();
    modUsuarios.usuarios.clear();

    const modGasolineras = {
        getGasolinera: () => ({ getFuelLiters: () => 100, getTotalCapacity: () => 500, getHosesNumber: () => 1 }),
        updateGasolinera: jest.fn()
    };

    const u1 = new Usuario("ZZZ999", "Asunción");
    await modUsuarios.addUsuario(u1);

    expect(modUsuarios.getUsuario("ZZZ999").getEnFila()).toBe("Asunción");

    await confirmFuelLoad("ZZZ999", "Asunción", modUsuarios, modGasolineras);

    expect(modUsuarios.getUsuario("ZZZ999").getEnFila()).toBe(null);
    });


    it("Deberían disminuir los litros de combustible de la gasolinera al confirmar la carga de combustible.", async () => {
        const modUsuarios = new ModUsuarios();
        modUsuarios.usuarios.clear();
      
        const mockGasolinera = {
          getFuelLiters: () => 100,
          getTotalCapacity: () => 500,
          getHosesNumber: () => 2,
          name: "Asunción"
        };
      
        const modGasolineras = {
          getGasolinera: () => mockGasolinera,
          updateGasolinera: jest.fn()
        };
      
        const u1 = new Usuario("YYY888", "Asunción");
        await modUsuarios.addUsuario(u1);
      
        await confirmFuelLoad("YYY888", "Asunción", modUsuarios, modGasolineras);
      
        expect(modGasolineras.updateGasolinera).toHaveBeenCalledWith("Asunción", 60, 500); // 100 - 40
      });
      
  });