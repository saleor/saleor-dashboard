import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";

export function visitAndWaitForProgressBarToDisappear(url) {
  cy.visit(url);
  return waitForProgressBarToNotVisible();
}

export function waitForProgressBarToNotVisible() {
  return cy.get(SHARED_ELEMENTS.progressBar).should("be.not.visible");
}

export function waitForProgressBarToNotExist() {
  return cy.get(SHARED_ELEMENTS.progressBar).should("not.exist");
}
