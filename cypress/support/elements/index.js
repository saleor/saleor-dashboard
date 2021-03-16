Cypress.Commands.add("getTextFromElement", element =>
  cy.get(element).invoke("text")
);
