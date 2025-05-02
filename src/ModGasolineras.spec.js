import ModGasolineras from "./ModGasolineras.js";
import Gasolinera from "./Gasolinera.js";
describe("Gasolinera", () => {
    it("Deberia devolver la cantidad de gasolineras", async () => {
        const gasolineras = new ModGasolineras();
        expect(await gasolineras.addGasolinera(new Gasolinera(1000, 50000, "Asunción"))).toBeGreaterThan(0);
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

    it("Debería ingresar datos mockeados y mostrar la cantidad de registros", async () => {
        const gasolineras = new ModGasolineras();
        if(gasolineras.gasolineras.size === 0){
            expect(await gasolineras.insertFakeData()).toEqual(4);
        }
        else{
            expect(await gasolineras.insertFakeData()).toBeGreaterThan(0);
        }
    });

    it("Debería conectarse correctamente a la BD y devolver un mensaje", () => {
        const gasolineras = new ModGasolineras();
        expect(gasolineras.reviewDbConnection()).toEqual("Conexión exitosa");
    });

    it("Debería insertar los datos desde la base de datos", async () => {
        const gasolineras = new ModGasolineras();
        gasolineras.gasolineras.clear();
        await gasolineras.loadFromFirestore();
        expect(gasolineras.gasolineras.size).toBeGreaterThan(0);
    });

    it("Debería botar un error cuando se intenta actualizar una gasolinera que no existe", async () => {
        const gasolineras = new ModGasolineras();
        expect(await gasolineras.updateGasolinera("EstaGasolineraNoExiste")).toBeFalsy();
    });

    it("Debería cambiar la cantidad de litros disponible del surtidor", async () => {
        const gasolineras = new ModGasolineras();
        const updateValue = Math.floor(Math.random() * 90000);
        await gasolineras.updateGasolinera("GasolineraDePrueba", updateValue);
        expect(gasolineras.getGasolinera("GasolineraDePrueba").getFuelLiters()).toEqual(updateValue);
    });

    it("Debería cambiar la capacidad del surtidor", async () => {
        const gasolineras = new ModGasolineras();
        const updateValue = Math.floor(Math.random() * 90000);
        await gasolineras.updateGasolinera("GasolineraDePrueba", 40000, updateValue);
        expect(gasolineras.getGasolinera("GasolineraDePrueba").getTotalCapacity()).toEqual(updateValue);
    });

    it("Debería indicar que los datos ya han sido cargados", async () => {
        const gasolineras = new ModGasolineras();
        expect(await gasolineras.ready()).toBeTruthy();
    });
});