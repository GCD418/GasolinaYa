import DbHandler from "./DbHandler";
describe("Firestore database Handler", () => {
    it("Debería devolver la configuración básica de Firebase", async () => {
        const dbHandler = new DbHandler();
        expect(typeof dbHandler.firebaseconfig).toEqual("object");
    });


});