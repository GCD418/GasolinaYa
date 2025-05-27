describe('Prueba de registro en fila y label de placa', () => {
  it('debería mostrar el label de la placa después de registrarse en fila', () => {
    cy.visit('/userIndex.html');
    cy.get('#add_queue_button').should('be.visible');
    cy.get('#add_queue_button').click();
    cy.get('.placa-label').should('not.exist');
    cy.get('#queue-popup').should('be.visible');
    cy.get('#usuario-selector').select('ABC123');
    cy.get('#confirm-placa').should('be.visible').click();
    cy.get('#gasolinera-selection').invoke('css', 'display', 'block').should('be.visible');
    cy.get('#gasolinera-selector').select('El Cristo');
    cy.get('#confirm-queue').invoke('css', 'display', 'block').should('be.visible').and('not.have.css', 'display', 'none').click();
    cy.get('#queue-popup').should('not.exist');
    cy.get('.placa-label').should('be.visible');
    cy.get('.placa-text').should('contain', 'ABC123 en fila');
  });
});