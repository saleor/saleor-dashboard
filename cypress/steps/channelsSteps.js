import { ADD_CHANNEL_FORM_SELECTORS } from "../elements/channels/add-channel-form-selectors";
import { CHANNELS_SELECTORS } from "../elements/channels/channels-selectors";

export function createChannelByView(name, currency, slug = name) {
  cy.get(CHANNELS_SELECTORS.createChannelButton)
    .click()
    .get(ADD_CHANNEL_FORM_SELECTORS.channelName)
    .type(name)
    .get(ADD_CHANNEL_FORM_SELECTORS.slug)
    .type(slug)
    .get(ADD_CHANNEL_FORM_SELECTORS.currency)
    .click();
  cy.get(ADD_CHANNEL_FORM_SELECTORS.currency).type(currency);
  cy.get("body").then($body => {
    if ($body.find(currency).length) {
      cy.contains(ADD_CHANNEL_FORM_SELECTORS.currencyOptions, currency).click();
    } else {
      cy.get(ADD_CHANNEL_FORM_SELECTORS.currencyAutocompleteDropdown).click();
    }
  });
  cy.get(ADD_CHANNEL_FORM_SELECTORS.saveButton).click();
}
