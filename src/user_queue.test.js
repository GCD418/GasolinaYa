import { calculate_waiting_time, estimate_fuel_load } from "./user_queue";

describe("Agregar en la fila", () => {
  it("deberia calcular el tiempo de espera", () => {
    expect(calculate_waiting_time(4)).toEqual(20);
  });
  it("deberia estimar si tiene posibilidad de cargar combustible", () => {
    expect(estimate_fuel_load(100, 2)).toEqual("Si");
  });
});


