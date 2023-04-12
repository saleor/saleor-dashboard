import { CHANNEL_FORM_SELECTORS, ORDERS_SELECTORS } from "../../elements";

export function pickAndSelectChannelOnCreateOrderFormByIndex(index) {
  cy.get(ORDERS_SELECTORS.createOrderButton)
    .click()
    .get(CHANNEL_FORM_SELECTORS.channelSelect)
    .click()
    .get(CHANNEL_FORM_SELECTORS.channelOption)
    .eq(index)
    .click();
}
