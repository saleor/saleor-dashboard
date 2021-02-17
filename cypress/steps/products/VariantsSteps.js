import { VARIANTS_SELECTORS } from "../../elements/catalog/variants-selectors";
class VariantsSteps {
  createFirstVariant(sku, warehouseId) {
    cy.get(PRODUCTS_SELECTORS.addVariantsButton)
      .click()
      .get(VARIANTS_SELECTORS.attributeCheckbox)
      .first()
      .click()
      .get(VARIANTS_SELECTORS.nextButton)
      .click()
      .get(VARIANTS_SELECTORS.priceInput)
      .type(10)
      .get(`[name*='${warehouseId}']`)
      .click()
      .get(VARIANTS_SELECTORS.nextButton)
      .click()
      .get(VARIANTS_SELECTORS.skuInput)
      .type(sku)
      .get(VARIANTS_SELECTORS.nextButton)
      .click()
      .waitForGraph("ProductVariantBulkCreate");
  }
  createVariant(sku, warehouseName) {
    cy.get(PRODUCTS_SELECTORS.addVariantsButton)
      .click()
      .get(VARIANTS_SELECTORS.attributeSelector)
      .click()
      .get(VARIANTS_SELECTORS.attributeOption)
      .first()
      .click()
      .get(VARIANTS_SELECTORS.priceInput)
      .type(10)
      .get(VARIANTS_SELECTORS.skuInputInAddVariant)
      .type(sku)
      .get(VARIANTS_SELECTORS.addWarehouseButton)
      .click()
      .get(VARIANTS_SELECTORS.warehouseOption)
      .contains(warehouseName)
      .click()
      .get(VARIANTS_SELECTORS.saveButton)
      .click();
  }
}
export default VariantsSteps;
