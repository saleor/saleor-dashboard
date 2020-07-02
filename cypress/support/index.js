Cypress.Commands.add("loginUser", (email, password) =>
  cy
    .get("input[name='email']")
    .type(email)
    .get("input[name='password']")
    .type(password)
    .get("[data-tc=submit]")
    .click()
    .get("[data-test=welcomeHeader]")
    .should("contain", "Hello there", { timeoout: 20000 })
);

Cypress.Commands.add("clearSessionData", () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit("/", {
    onBeforeLoad: win => {
      win.sessionStorage.clear();
    }
  });
});
