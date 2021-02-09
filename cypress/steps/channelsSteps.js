import { ADD_CHANNEL_FORM_SELECTOS } from "../elements/channels/add-channel-form-selectors";
import { CHANNELS_SELECTORS } from "../elements/channels/channels-selectors";

class ChannelsSteps {
  createChannelByView(name, currency, otherCurrency, slug = name) {
    cy.get(CHANNELS_SELECTORS.createChannelButton)
      .click()
      .get(ADD_CHANNEL_FORM_SELECTOS.channelName)
      .type(name)
      .get(ADD_CHANNEL_FORM_SELECTOS.slug)
      .type(slug)
      .get(ADD_CHANNEL_FORM_SELECTOS.currency)
      .click();
    if (!otherCurrency) {
      cy.get(ADD_CHANNEL_FORM_SELECTOS.currency).type(currency);
      cy.get(`[data-test-value=${currency}]`).click();
    } else {
      cy.get(ADD_CHANNEL_FORM_SELECTOS.currency)
        .type(otherCurrency)
        .get(ADD_CHANNEL_FORM_SELECTOS.currencyAutocompliteDropdown)
        .click();
    }
    cy.get(ADD_CHANNEL_FORM_SELECTOS.saveButton).click();
  }
}
export default ChannelsSteps;
