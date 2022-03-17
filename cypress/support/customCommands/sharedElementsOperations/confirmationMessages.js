import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";

Cypress.Commands.add("confirmationMessageShouldDisappear", () => {
  cy.get(SHARED_ELEMENTS.notificationSuccess)
    .should("be.visible")
    .get(SHARED_ELEMENTS.notificationSuccess)
    .should("not.exist");
});

Cypress.Commands.add("confirmationMessageShouldAppear", () => {
  cy.get(SHARED_ELEMENTS.notificationSuccess).should("be.visible");
});
