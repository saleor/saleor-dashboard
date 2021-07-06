import { COLLECTION_SELECTORS } from "../elements/catalog/collection-selectors";
import { PRODUCT_DETAILS } from "../elements/catalog/products/product-details";
import { AVAILABLE_CHANNELS_FORM } from "../elements/channels/available-channels-form";
import { SELECT_CHANNELS_TO_ASSIGN } from "../elements/channels/select-channels-to-assign";
import { ASSIGN_ELEMENTS_SELECTORS } from "../elements/shared/assign-elements-selectors";
import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../elements/shared/sharedElements";

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
  cy.contains(SELECT_CHANNELS_TO_ASSIGN.channelRow, channel.name)
    .find(SELECT_CHANNELS_TO_ASSIGN.channelCheckbox)
    .click()
    .get(BUTTON_SELECTORS.submit)
    .click()
    .get(AVAILABLE_CHANNELS_FORM.availableChannel)
    .click()
    .get(`${AVAILABLE_CHANNELS_FORM.publishedRadioButtons}${publishedSelector}`)
    .click();
  cy.addAliasToGraphRequest("CreateCollection");
  cy.get(COLLECTION_SELECTORS.saveButton).click();
  cy.get(SHARED_ELEMENTS.confirmationMsg).should("be.visible");
  return cy
    .wait("@CreateCollection")
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
  cy.wait("@CollectionAssignProduct");
}
