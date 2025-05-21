import ModUsuarios from "./ModUsuarios";
import Usuario from "./Usuario";

describe("ModUsuarios", () => {
    it("Debería insertar los datos desde la base de datos", async () => {
        const usuarios = new ModUsuarios();
        usuarios.usuarios.clear();
        await usuarios.loadFromFirestore();
        expect(usuarios.usuarios.size).toBeGreaterThan(0);
    });

    it("Deberia devolver la cantidad de usuarios", async () => {
        const usuarios = new ModUsuarios();
        expect(await usuarios.addUsuario(new Usuario("ABC123"))).toBeGreaterThan(0);
    });

    it("Deberia devolver el usuario en funcion de la placa", () => {
        const usuarios = new ModUsuarios();
        const usuario = new Usuario("AAA123");
        usuarios.addUsuario(usuario);
        expect(usuarios.getUsuario("AAA123")).toEqual(usuario);
    });

    it("Deberia devolver un tipo de dato resultante de una instancia de Map", () => {
        const usuarios = new ModUsuarios();
        const usuario = new Usuario("ABC123");
        usuarios.addUsuario(usuario);
        expect(usuarios.getUsuarios() instanceof Map).toEqual(true);
    });

    it("Debería mostrar error cuando se intenta actualizar un usuario que no existe", async () => {
        const usuarios = new ModUsuarios();
        expect(await usuarios.updateUsuario("EsteUsuarioNoExiste")).toBeFalsy();
    });

});