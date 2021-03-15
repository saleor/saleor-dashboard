Cypress.Commands.add(
  "handleDeleteElement",
  (element, deleteFunction, startsWith) => {
    if (element.node.name.includes(startsWith)) {
      deleteFunction(element.node.id);
    }
  }
);
Cypress.Commands.add(
  "deleteElementsStartsWith",
  (deleteFunction, getFunction, startsWith, name) => {
    getFunction(100, startsWith).then(elements => {
      elements.forEach(element => {
        cy.handleDeleteElement(element, deleteFunction, startsWith);
      });
    });
  }
);
