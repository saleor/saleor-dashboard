import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";

Cypress.Commands.add("visitAndWaitForProgressBarToDisappear", url => {
  cy.visit(url).waitForProgressBarToNotBeVisible();
});

Cypress.Commands.add("waitForProgressBarToNotBeVisible", () => {
  cy.get(SHARED_ELEMENTS.progressBar).should("be.not.visible");
});

Cypress.Commands.add("waitForProgressBarToNotExist", () => {
  cy.get(SHARED_ELEMENTS.progressBar).should("not.exist");
});
