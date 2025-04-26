import ModGasolineras from "./ModGasolineras.js";
import Gasolinera from "./Gasolinera.js";
describe("Gasolinera", () => {
    it("Deberia devolver la cantidad de gasolineras", () => {
        const gasolineras = new ModGasolineras();
        expect(gasolineras.addGasolinera(new Gasolinera(1000, 50000, "Asunción"))).toEqual(1);
    });

});