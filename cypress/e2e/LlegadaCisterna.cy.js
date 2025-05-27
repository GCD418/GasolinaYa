describe("Registro de llegada de cisterna", () => {
  it("debería incrementar los litros correctamente y mostrar una alerta", () => {
    cy.visit("/adminIndex.html");

    
    cy.get("#select_gasolinera")
      .select("El Cristo")
      .should("have.value", "El Cristo");

    cy.get("#liter_quantity_input")
      .invoke("val")
      .then((valorAntes) => {
        const litrosAntes = parseInt(valorAntes);

        cy.get("#cisterna_liters_input").clear().type("50");

        cy.window().then((win) => {
          cy.stub(win, "alert").as("alerta");
        });

        cy.get("#register_cistern_button").click();

    
        cy.get("#liter_quantity_input")
          .invoke("val")
          .should((valorDespues) => {
            const litrosDespues = parseInt(valorDespues);
            expect(litrosDespues).to.eq(litrosAntes + 50);
          });
      });
  });
});
