import { COLLECTION_SELECTORS } from "../elements/catalog/collection-selectors";
import { ASSIGN_PRODUCTS_SELECTORS } from "../elements/catalog/products/assign-products-selectors";
import { MENAGE_CHANNEL_AVAILABILITY_FORM } from "../elements/channels/menage-channel-availability-form";
import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";

export function createCollection(collectionName, isPublished, channel) {
  const publishedSelector = isPublished
    ? MENAGE_CHANNEL_AVAILABILITY_FORM.radioButtonsValueTrue
    : MENAGE_CHANNEL_AVAILABILITY_FORM.radioButtonsValueFalse;

  cy.get(COLLECTION_SELECTORS.createCollectionButton)
    .click()
    .get(COLLECTION_SELECTORS.nameInput)
    .type(collectionName)
    .get(MENAGE_CHANNEL_AVAILABILITY_FORM.channelsMenageButton)
    .click()
    .get(MENAGE_CHANNEL_AVAILABILITY_FORM.allChannelsCheckbox)
    .click();
  cy.contains(MENAGE_CHANNEL_AVAILABILITY_FORM.channelRow, channel.name)
    .find(MENAGE_CHANNEL_AVAILABILITY_FORM.channelCheckbox)
    .click()
    .get(BUTTON_SELECTORS.submit)
    .click()
    .get(MENAGE_CHANNEL_AVAILABILITY_FORM.channelsAvailabilityItem)
    .click()
    .get(
      `${MENAGE_CHANNEL_AVAILABILITY_FORM.publishedCheckbox}${publishedSelector}`
    )
    .click();
  cy.addAliasToGraphRequest("CreateCollection");
  cy.get(COLLECTION_SELECTORS.saveButton).click();
  return cy
    .wait("@CreateCollection")
    .its("response.body.data.collectionCreate.collection");
}
export function assignProductsToCollection(productName) {
  cy.get(COLLECTION_SELECTORS.addProductButton)
    .click()
    .get(ASSIGN_PRODUCTS_SELECTORS.searchInput)
    .type(productName);
  cy.contains(ASSIGN_PRODUCTS_SELECTORS.tableRow, productName)
    .find(ASSIGN_PRODUCTS_SELECTORS.checkbox)
    .click();
  cy.addAliasToGraphRequest("CollectionAssignProduct");
  cy.get(ASSIGN_PRODUCTS_SELECTORS.submitButton).click();
  cy.wait("@CollectionAssignProduct");
}
