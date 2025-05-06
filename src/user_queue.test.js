import calculate_waiting_time from "./user_queue";

describe("Agregar en la fila", () => {
  it("deberia calcular el tiempo de espera", () => {
    expect(calculate_waiting_time(4)).toEqual(20);
  });
});


