import { PRODUCTS_SELECTORS } from "../../elements/catalog/products/product-selectors";

const valueTrue = PRODUCTS_SELECTORS.radioButtonsValueTrue;
const valueFalse = PRODUCTS_SELECTORS.radioButtonsValueFalse;

export function updateProductIsAvailableForPurchase(
  productUrl,
  isAvailableForPurchase
) {
  const isAvailableForPurchaseSelector = isAvailableForPurchase
    ? valueTrue
    : valueFalse;
  const availableForPurchaseSelector = `${PRODUCTS_SELECTORS.availableForPurchaseRadioButtons}${isAvailableForPurchaseSelector}`;
  updateProductMenageInChannel(productUrl, availableForPurchaseSelector);
}
export function updateProductPublish(productUrl, isPublished) {
  const isPublishedSelector = isPublished ? valueTrue : valueFalse;
  const publishedSelector = `${PRODUCTS_SELECTORS.publishedRadioButtons}${isPublishedSelector}`;
  updateProductMenageInChannel(productUrl, publishedSelector);
}
export function updateProductVisibleInListings(productUrl) {
  updateProductMenageInChannel(
    productUrl,
    PRODUCTS_SELECTORS.visibleInListingsButton
  );
}
function updateProductMenageInChannel(productUrl, menageSelector) {
  cy.visit(productUrl)
    .get(PRODUCTS_SELECTORS.assignedChannels)
    .click()
    .get(menageSelector)
    .click();
  cy.addAliasToGraphRequest("ProductChannelListingUpdate");
  cy.get(PRODUCTS_SELECTORS.saveBtn)
    .click()
    .wait("@ProductChannelListingUpdate");
}
