import Gasolinera from "./Gasolinera.js";
describe("Gasolinera", () => {
    it("Deberia devolver la cantidad de litros de gasolina (1000)", () => {
        const gasolinera = new Gasolinera(1000);
        expect(gasolinera.getFuelLiters()).toEqual(1000);
    });

    it("Deberia devolver la cantidad de litros de gasolina (4000)", () => {
        const gasolinera = new Gasolinera(4000);
        expect(gasolinera.getFuelLiters()).toEqual(4000);
    });
});