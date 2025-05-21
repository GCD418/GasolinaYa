import ModUsuarios from "./ModUsuarios";
import Usuario from "./Usuario";

describe("ModUsuarios", () => {
    it("Debería insertar los datos desde la base de datos", async () => {
        const usuarios = new ModUsuarios();
        usuarios.usuarios.clear();
        await usuarios.loadFromFirestore();
        expect(usuarios.usuarios.size).toBeGreaterThan(0);
    });
});