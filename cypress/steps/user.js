import { SET_PASSWORD } from "../elements/account/setPassword";
import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";

export function fillUpSetPassword(password) {
  cy.get(SET_PASSWORD.confirmPasswordInput)
    .type(password)
    .get(SET_PASSWORD.passwordInput)
    .type(password)
    .get(BUTTON_SELECTORS.confirm)
    .click();
}
