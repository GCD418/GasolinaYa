import DbHandler from "./DbHandler";
describe("Firestore database Handler", () => {
    it("Debería devolver la configuración básica de Firebase", () => {
        const dbHandler = new DbHandler();
        expect(typeof dbHandler.firebaseconfig).toEqual("object");
    });

    it("Debería devolver el tipo del objeto base de datos", () => {
        const dbHandler = new DbHandler();
        expect(typeof dbHandler.getDb()).toEqual("object");
    });


});