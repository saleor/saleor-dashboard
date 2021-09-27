import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";

// export function confirmationMessageShouldDisappear() {
//   cy.get(SHARED_ELEMENTS.notificationSuccess)
//     .should("be.visible")
//     .get(SHARED_ELEMENTS.notificationSuccess)
//     .should("not.exist");
// }

Cypress.Commands.add("confirmationMessageShouldDisappear", () => {
  cy.get(SHARED_ELEMENTS.notificationSuccess)
    .should("be.visible")
    .get(SHARED_ELEMENTS.notificationSuccess)
    .should("not.exist");
});
