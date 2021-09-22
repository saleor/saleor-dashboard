import { COLLECTION_SELECTORS } from "../../../elements/catalog/collection-selectors";
import { AVAILABLE_CHANNELS_FORM } from "../../../elements/channels/available-channels-form";
import { SELECT_CHANNELS_TO_ASSIGN } from "../../../elements/channels/select-channels-to-assign";
import { ASSIGN_ELEMENTS_SELECTORS } from "../../../elements/shared/assign-elements-selectors";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";

export function createCollection(collectionName, isPublished, channel) {
  const publishedSelector = isPublished
    ? AVAILABLE_CHANNELS_FORM.radioButtonsValueTrue
    : AVAILABLE_CHANNELS_FORM.radioButtonsValueFalse;

  cy.get(COLLECTION_SELECTORS.createCollectionButton)
    .click()
    .get(COLLECTION_SELECTORS.nameInput)
    .type(collectionName)
    .get(AVAILABLE_CHANNELS_FORM.menageChannelsButton)
    .click()
    .get(SELECT_CHANNELS_TO_ASSIGN.allChannelsCheckbox)
    .click();
  return cy
    .contains(SELECT_CHANNELS_TO_ASSIGN.channelRow, channel.name)
    .find(SELECT_CHANNELS_TO_ASSIGN.channelCheckbox)
    .click()
    .get(BUTTON_SELECTORS.submit)
    .click()
    .get(AVAILABLE_CHANNELS_FORM.availableChannel)
    .click()
    .get(`${AVAILABLE_CHANNELS_FORM.publishedRadioButtons}${publishedSelector}`)
    .click()
    .addAliasToGraphRequest("CreateCollection")
    .get(COLLECTION_SELECTORS.saveButton)
    .click()
    .confirmationMessageShouldDisappear()
    .waitForRequestAndCheckIfNoErrors("@CreateCollection")
    .its("response.body.data.collectionCreate.collection");
}

export function assignProductsToCollection(productName) {
  cy.get(COLLECTION_SELECTORS.addProductButton)
    .click()
    .get(ASSIGN_ELEMENTS_SELECTORS.searchInput)
    .type(productName);
  cy.contains(ASSIGN_ELEMENTS_SELECTORS.tableRow, productName)
    .find(ASSIGN_ELEMENTS_SELECTORS.checkbox)
    .click();
  cy.addAliasToGraphRequest("CollectionAssignProduct");
  cy.get(ASSIGN_ELEMENTS_SELECTORS.submitButton).click();
  cy.waitForRequestAndCheckIfNoErrors("@CollectionAssignProduct");
}
