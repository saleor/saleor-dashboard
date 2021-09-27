Cypress.Commands.add("getTextFromElement", element =>
  cy.get(element).invoke("text")
);

Cypress.Commands.add("clearAndType", { prevSubject: true }, (subject, text) => {
  cy.wrap(subject)
    .clear()
    .type(text);
});

Cypress.Commands.add("waitForRequestAndCheckIfNoErrors", alias => {
  cy.wait(alias).then(resp => {
    expect(resp.response.body.errors).to.be.undefined;
    return resp;
  });
});
