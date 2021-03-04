import { PRODUCTS_SELECTORS } from "../../elements/catalog/products/product-selectors";

class ProductSteps {
  valueTrue = PRODUCTS_SELECTORS.radioButtonsValueTrue;
  valueFalse = PRODUCTS_SELECTORS.radioButtonsValueFalse;

  updateProductIsAvailableForPurchase(productUrl, isAvailableForPurchase) {
    const isAvailableForPurchaseSelector = isAvailableForPurchase
      ? this.valueTrue
      : this.valueFalse;
    const availableForPurchaseSelector = `${PRODUCTS_SELECTORS.availableForPurchaseRadioButtons}${isAvailableForPurchaseSelector}`;
    this.updateProductMenageInChannel(productUrl, availableForPurchaseSelector);
  }
  updateProductPublish(productUrl, isPublished) {
    const isPublishedSelector = isPublished ? this.valueTrue : this.valueFalse;
    const publishedSelector = `${PRODUCTS_SELECTORS.publishedRadioButtons}${isPublishedSelector}`;
    this.updateProductMenageInChannel(productUrl, publishedSelector);
  }
  updateProductVisibleInListings(productUrl) {
    this.updateProductMenageInChannel(
      productUrl,
      PRODUCTS_SELECTORS.visibleInListingsButton
    );
  }
  updateProductMenageInChannel(productUrl, menageSelector) {
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
}
export default ProductSteps;
