import { PRODUCT_TYPE_DETAILS } from "../elements/productTypes/productTypeDetails";
import { PRODUCT_TYPES_LIST } from "../elements/productTypes/productTypesList";
import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";
import { waitForProgressBarToNotBeVisible } from "./shared/progressBar";

export function createProductType(name, shippingWeight) {
  cy.get(PRODUCT_TYPES_LIST.addProductTypeButton).click();
  waitForProgressBarToNotBeVisible()
    .get(PRODUCT_TYPE_DETAILS.nameInput)
    .type(name);
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
    .wait("@ProductTypeCreate")
    .its("response.body.data.productTypeCreate.productType");
}
