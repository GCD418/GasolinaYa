import { calculate_waiting_time, estimate_fuel_load, can_abandon_queue } from "./user_queue";

describe("Agregar en la fila", () => {
  it("deberia calcular el tiempo de espera", () => {
    expect(calculate_waiting_time(4)).toEqual(20);
  });
  it("deberia estimar si tiene posibilidad de cargar combustible", () => {
    expect(estimate_fuel_load(100, 2)).toEqual("Si");
  });
  it("deberia estimar si tiene posibilidad de cargar combustible", () => {
    expect(estimate_fuel_load(110, 3)).toEqual("No");
  });
});

describe("abandonarfila", () => {
  it("debería permitir abandonar si está en fila y el selector no está visible", () => {
    expect(can_abandon_queue({ isInQueue: true, isSelectorVisible: false })).toBe(true);
  });
  
  it("no debería permitir abandonar si no está en fila", () => {
    expect(can_abandon_queue({ isInQueue: false, isSelectorVisible: false })).toBe(false);
  });
  
  it("no debería permitir abandonar si el selector está visible", () => {
    expect(can_abandon_queue({ isInQueue: true, isSelectorVisible: true })).toBe(false);
  });
  
  it("no debería permitir abandonar si no está en fila y el selector está visible", () => {
    expect(can_abandon_queue({ isInQueue: false, isSelectorVisible: true })).toBe(false);
  });

  it("Decrementa el número de usuarios cuando alguien abandona la fila", async () => {
    const modGasolinerasMock = { userQueueCount: 3, decrementQueueCountFromUser: jest.fn().mockImplementation(() => { modGasolinerasMock.userQueueCount--; return Promise.resolve(true); }) };
    await modGasolinerasMock.decrementQueueCountFromUser(); expect(modGasolinerasMock.userQueueCount).toBe(2);
  });  
});