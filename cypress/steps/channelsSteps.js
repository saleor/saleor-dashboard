import { ADD_CHANNEL_FORM_SELECTORS } from "../elements/channels/add-channel-form-selectors";
import { CHANNELS_SELECTORS } from "../elements/channels/channels-selectors";
import { HEADER_SELECTORS } from "../elements/header/header-selectors";

export function createChannelByView(
  name,
  currency,
  otherCurrency,
  slug = name
) {
  cy.get(CHANNELS_SELECTORS.createChannelButton)
    .click()
    .get(ADD_CHANNEL_FORM_SELECTORS.channelName)
    .type(name)
    .get(ADD_CHANNEL_FORM_SELECTORS.slug)
    .type(slug)
    .get(ADD_CHANNEL_FORM_SELECTORS.currency)
    .click();
  if (!otherCurrency) {
    cy.get(ADD_CHANNEL_FORM_SELECTORS.currency).type(currency);
    cy.get(`[data-test-value=${currency}]`).click();
  } else {
    cy.get(ADD_CHANNEL_FORM_SELECTORS.currency)
      .type(otherCurrency)
      .get(ADD_CHANNEL_FORM_SELECTORS.currencyAutocompleteDropdown)
      .click();
  }
  cy.get(ADD_CHANNEL_FORM_SELECTORS.saveButton).click();
}
export function selectChannelInHeader(channelName) {
  cy.get(HEADER_SELECTORS.channelSelect)
    .click()
    .get(HEADER_SELECTORS.channelSelectList)
    .contains(channelName)
    .click();
}
