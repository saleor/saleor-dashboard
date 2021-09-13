declare namespace Cypress {
  interface Chainable<Subject> {
    clearSessionData(): Chainable<any>;
  }
}
