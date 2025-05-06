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

    it("Deberia devolver la capacidad del surtidor en litros", () => {
        const gasolinera = new Gasolinera(4000, 20000);
        expect(gasolinera.getTotalCapacity()).toEqual(20000);
    });

    it("Deberia devolver la capacidad del surtidor en litros", () => {
        const gasolinera = new Gasolinera(4000, 40000);
        expect(gasolinera.getTotalCapacity()).toEqual(40000);
    });

    it("Deberia devolver el porcentaje de litros restantes respecto a la capacidad del Surtidor", () => {
        const gasolinera = new Gasolinera(4000, 40000);
        expect(gasolinera.getFuelPercent()).toEqual(10);
    });

    it("Deberia devolver el porcentaje de litros restantes respecto a la capacidad del Surtidor", () => {
        const gasolinera = new Gasolinera(40000, 40000);
        expect(gasolinera.getFuelPercent()).toEqual(100);
    });

    it("Deberia devolver el nombre de la Gasolinera", () => {
        const gasolinera = new Gasolinera(40000, 40000, "El Cristo");
        expect(gasolinera.getName()).toEqual("El Cristo");
    });

    it("Deberia devolver la cantidad de autos en la cola de la gasolinera", () => {
        const gasolinera = new Gasolinera(40000, 40000, "El Cristo");
        expect(gasolinera.getQueueCount()).toEqual(0);
    });

    it("Deberia adicionar la cantidad de combustible", () => {
        const gasolinera = new Gasolinera(20000, 40000, "El Cristo");
        expect(gasolinera.addFuel(10000)).toEqual(30000);
    });

    it("Deberia devolver la capacidad del surtidor si el tamaño de la cisterna mas mi stock actual es mayor", () => {
        const gasolinera = new Gasolinera(20000, 40000, "El Cristo");
        expect(gasolinera.addFuel(30000)).toEqual(40000);
    });
});