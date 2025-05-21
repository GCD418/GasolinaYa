import Usuario from './Usuario.js';
describe("Usuario", () => {
    it("Deberia devolver la placa del auto", () => {
        const usuario = new Usuario("XYZ123");
        expect(usuario.getPlaca()).toEqual("XYZ123");
    });
    it("Deberia devolver el estado de si esta en fila", () => {
        const usuario = new Usuario("XYZ123");
        expect(usuario.getEnFila()).toEqual(null);
    });
    it("Deberia devolver el estado de si tiene ticket", () => {
        const usuario = new Usuario("XYZ123");
        expect(usuario.getConTicket()).toEqual(null);
    });
    it("Deberia devolver el nombre de la E.S. que esta en fila", () => {
        const usuario = new Usuario("XYZ123");
        usuario.setEnFila("EstacionDePrueba");
        expect(usuario.getEnFila()).toEqual("EstacionDePrueba");
    });
});

