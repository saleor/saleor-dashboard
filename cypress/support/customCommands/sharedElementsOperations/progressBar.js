import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";

// export function visitAndWaitForProgressBarToDisappear(url) {
//   cy.visit(url);
//   return waitForProgressBarToNotBeVisible();
// }

// export function waitForProgressBarToNotBeVisible() {
//   return cy.get(SHARED_ELEMENTS.progressBar).should("be.not.visible");
// }

// export function waitForProgressBarToNotExist() {
//   return cy.get(SHARED_ELEMENTS.progressBar).should("not.exist");
// }

Cypress.Commands.add("visitAndWaitForProgressBarToDisappear", url => {
  cy.visit(url).waitForProgressBarToNotBeVisible();
});

Cypress.Commands.add("waitForProgressBarToNotBeVisible", () => {
  cy.get(SHARED_ELEMENTS.progressBar).should("be.not.visible");
});

Cypress.Commands.add("waitForProgressBarToNotExist", () => {
  cy.get(SHARED_ELEMENTS.progressBar).should("not.exist");
});
