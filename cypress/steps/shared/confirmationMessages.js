import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";

export function confirmationMessageShouldDisappear() {
  cy.get(SHARED_ELEMENTS.confirmationMsg)
    .should("be.visible")
    .get(SHARED_ELEMENTS.confirmationMsg)
    .should("not.exist");
}
