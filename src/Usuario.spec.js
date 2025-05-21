import Usuario from './Usuario.js';
describe("Usuario", () => {
    it("Deberia devolver la placa del auto", () => {
        const usuario = new Usuario("XYZ123");
        expect(usuario.getPlaca()).toEqual("XYZ123");
    });
});

