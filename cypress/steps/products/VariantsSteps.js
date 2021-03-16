import { PRODUCTS_SELECTORS } from "../../elements/catalog/products/product-selectors";
import { VARIANTS_SELECTORS } from "../../elements/catalog/variants-selectors";

export function createFirstVariant({ sku, warehouseId, price, attribute }) {
  cy.get(PRODUCTS_SELECTORS.addVariantsButton).click();
  cy.get(VARIANTS_SELECTORS.valueContainer)
    .contains(attribute)
    .find(VARIANTS_SELECTORS.attributeCheckbox)
    .click()
    .get(VARIANTS_SELECTORS.nextButton)
    .click()
    .get(VARIANTS_SELECTORS.priceInput)
    .each($priceInput => {
      cy.wrap($priceInput).type(price);
    });
  cy.get(`[name*='${warehouseId}']`)
    .click()
    .get(VARIANTS_SELECTORS.nextButton)
    .click()
    .get(VARIANTS_SELECTORS.skuInput)
    .type(sku);
  cy.addAliasToGraphRequest("ProductVariantBulkCreate");
  cy.get(VARIANTS_SELECTORS.nextButton).click();
  cy.wait("@ProductVariantBulkCreate");
}
export function createVariant({
  sku,
  warehouseName,
  attributeName,
  price,
  costPrice = price
}) {
  cy.get(PRODUCTS_SELECTORS.addVariantsButton)
    .click()
    .get(VARIANTS_SELECTORS.attributeSelector)
    .click()
    .get(VARIANTS_SELECTORS.attributeOption)
    .contains(attributeName)
    .click()
    .get(VARIANTS_SELECTORS.priceInput)
    .type(price)
    .get(VARIANTS_SELECTORS.costPriceInput)
    .type(costPrice)
    .get(VARIANTS_SELECTORS.skuInputInAddVariant)
    .type(sku)
    .get(VARIANTS_SELECTORS.addWarehouseButton)
    .click();
  cy.contains(VARIANTS_SELECTORS.warehouseOption, warehouseName).click();
  cy.addAliasToGraphRequest("ProductVariantDetails");
  cy.get(VARIANTS_SELECTORS.saveButton).click();
  cy.wait("@ProductVariantDetails");
}
