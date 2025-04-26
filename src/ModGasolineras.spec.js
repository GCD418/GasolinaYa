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

    it("Deberia devolver un tipo de dato resultante de una instancia de Map", () => {
        const gasolineras = new ModGasolineras();
        const gasolinera = new Gasolinera(1000, 50000, "Asunción");
        gasolineras.addGasolinera(gasolinera);
        expect(gasolineras.getGasolineras() instanceof Map).toEqual(true);
    });

    it("Todas las instancias del modulo de gasolineras deberían contener los mismos datos", () => {
        const gasolineras1 = new ModGasolineras();
        const gasolineras2 = new ModGasolineras(); 
        const gasolinera = new Gasolinera(1000, 50000, "Asunción");
        gasolineras1.addGasolinera(gasolinera);
        expect(gasolineras1 === gasolineras2).toEqual(true);
    });

    it("Debería ingresar datos mockeados y mostrar la cantidad de registros", () => {
        const gasolineras = new ModGasolineras();
        expect(gasolineras.insertFakeData()).toEqual(4);
    });
});