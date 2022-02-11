import { ORDERS_SETTINGS_SELECTORS } from "../../../elements/orders/orders-settings-selectors";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { urlList } from "../../../fixtures/urlList";

export function selectAutomaticcallyConfirmAllOrdersAndSave() {
  cy.visit(urlList.ordersSettings)
    .waitForProgressBarToNotBeVisible()
    .get(ORDERS_SETTINGS_SELECTORS.automaticallyConfirmAllNewOrdersCheckbox)
    .click()
    .addAliasToGraphRequest("OrderSettingsUpdate")
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .wait("@OrderSettingsUpdate")
    .confirmationMessageShouldDisappear();
}
