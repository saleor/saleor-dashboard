Cypress.Commands.add("loginUser", (email, password) =>
  cy
    .get("input[name='email']")
    .type(email)
    .get("input[name='password']")
    .type(password)
    .get("[data-test=submit]")
    .click()
);

Cypress.Commands.add("clearSessionData", () => {
  // Because of known cypress bug, not all local storage data are cleared.
  // Here is workaround to ensure tests have no side effects.
  // Suggested usage:

  // beforeEach(() => {
  //   cy.clearSessionData();
  // });

  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit("/", {
    onBeforeLoad: win => {
      win.sessionStorage.clear();
    }
  });
});
