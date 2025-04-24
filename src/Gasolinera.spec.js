import Gasolinera from "./Gasolinera.js";
describe("Gasolinera", () => {
    it("Deberia devolver la cantidad de litros de gasolina", () => {
        const gasolinera = new Gasolinera(1000);
        expect(gasolinera.getFuelLiters()).toEqual(1000);
    });
});