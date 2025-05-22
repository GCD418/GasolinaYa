import { getPlacasEnFila } from "./GestionColas";

describe("Gestión de colas - SP2.5", () => {
  it("debería retornar placas en fila para una gasolinera específica", () => {
    const usuarios = [
      { placa: "AAA111", enFila: "Cristo" },
      { placa: "BBB222", enFila: "Cristo" },
      { placa: "CCC333", enFila: "Manantial" },
      { placa: "DDD444", enFila: null },
    ];

    const resultadoCristo = getPlacasEnFila("Cristo", usuarios);
    const resultadoManantial = getPlacasEnFila("Manantial", usuarios);
    const resultadoVacio = getPlacasEnFila("NoExiste", usuarios);

    expect(resultadoCristo).toEqual(["AAA111", "BBB222"]);
    expect(resultadoManantial).toEqual(["CCC333"]);
    expect(resultadoVacio).toEqual([]);
  });
});
