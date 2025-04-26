import ModGasolineras from "./ModGasolineras.js";
import Gasolinera from "./Gasolinera.js";
describe("Gasolinera", () => {
    it("Deberia devolver la cantidad de gasolineras", () => {
        const gasolineras = new ModGasolineras();
        expect(gasolineras.addGasolinera(new Gasolinera(1000, 50000, "Asunción"))).toEqual(1);
    });

    it("Deberia devolver la gasolinera en funcion del nombre", () => {
        const gasolineras = new ModGasolineras();
        const gasolinera = new Gasolinera(1000, 50000, "Asunción");
        gasolineras.addGasolinera(gasolinera);
        expect(gasolineras.getGasolinera("Asunción")).toEqual(gasolinera);
    });

});