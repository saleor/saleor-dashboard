import { PRODUCTS_SELECTORS } from "../elements/catalog/product-selectors";

class ProductSteps {
  updateProductIsAvailableForPurchase(productUrl, isAvailableForPurchase) {
    let isAvailableForPurchaseSelector;
    if (isAvailableForPurchase) {
      isAvailableForPurchaseSelector = PRODUCTS_SELECTORS.radioButtonsValueTrue;
    } else {
      isAvailableForPurchaseSelector =
        PRODUCTS_SELECTORS.radioButtonsValueFalse;
    }
    this.updateProductMenageInChannel(
      productUrl,
      `${PRODUCTS_SELECTORS.availableForPurchaseRadioButtons}${isAvailableForPurchaseSelector}`
    );
  }
  updateProductPublish(productUrl, isPublished) {
    let isPublishedSelector;
    if (isPublished) {
      isPublishedSelector = PRODUCTS_SELECTORS.radioButtonsValueTrue;
    } else {
      isPublishedSelector = PRODUCTS_SELECTORS.radioButtonsValueFalse;
    }
    this.updateProductMenageInChannel(
      productUrl,
      `${PRODUCTS_SELECTORS.publishedRadioButtons}${isPublishedSelector}`
    );
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
      .click()
      .get(PRODUCTS_SELECTORS.saveBtn)
      .click()
      .waitForGraph("ProductChannelListingUpdate");
  }
}
export default ProductSteps;
