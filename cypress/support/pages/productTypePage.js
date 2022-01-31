import { PRODUCT_TYPE_DETAILS } from "../../elements/productTypes/productTypeDetails";
import { PRODUCT_TYPES_LIST } from "../../elements/productTypes/productTypesList";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";

export function createProductType({ name, shippingWeight, giftCard = false }) {
  cy.get(PRODUCT_TYPES_LIST.addProductTypeButton)
    .click()
    .waitForProgressBarToNotBeVisible()
    .get(PRODUCT_TYPE_DETAILS.nameInput)
    .type(name);
  if (giftCard) {
    cy.get(PRODUCT_TYPE_DETAILS.giftCardKindCheckbox).click();
  }
  if (shippingWeight) {
    cy.get(PRODUCT_TYPE_DETAILS.isShippingRequired)
      .click()
      .get(PRODUCT_TYPE_DETAILS.shippingWeightInput)
      .type(shippingWeight);
  }
  return cy
    .addAliasToGraphRequest("ProductTypeCreate")
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .waitForRequestAndCheckIfNoErrors("@ProductTypeCreate")
    .its("response.body.data.productTypeCreate.productType");
}
