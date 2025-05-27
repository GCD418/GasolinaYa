describe("adminPresenter", () => {
  it("Debería aparecer el resumen de los datos al seleccionar una gasolinera", () => {
    cy.visit("/adminIndex.html");
    cy.wait(2000);
    cy.get("#select_gasolinera").select("GasolineraDePrueba");
    cy.get("h1").should("contain", "Estación de servicio \"GasolineraDePrueba\"");
  });

  it("Debería mantener el número de mangueras actualizado", () => {
    cy.visit("/adminIndex.html");
    cy.wait(2000);
    cy.get("#select_gasolinera").select("El Cristo");
    cy.get("#hoses_input").should("have.value", "5");
  });
});
