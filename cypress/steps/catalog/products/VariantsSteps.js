import { PRICE_LIST } from "../../../elements/catalog/products/price-list";
import { PRODUCT_DETAILS } from "../../../elements/catalog/products/product-details";
import { VARIANTS_SELECTORS } from "../../../elements/catalog/products/variants-selectors";
import { AVAILABLE_CHANNELS_FORM } from "../../../elements/channels/available-channels-form";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import { selectChannelVariantInDetailsPage } from "../../channelsSteps";
import { fillUpPriceList } from "./priceList";

export function variantsShouldBeVisible({ name, price }) {
  cy.contains(PRODUCT_DETAILS.variantRow, name)
    .should("be.visible")
    .find(PRODUCT_DETAILS.variantPrice)
    .invoke("text")
    .then(text => expect(text).to.includes(price));
}
export function createFirstVariant({ sku, warehouseId, price, attribute }) {
  cy.get(PRODUCT_DETAILS.addVariantsButton).click();
  cy.get(VARIANTS_SELECTORS.valueContainer)
    .click()
    .contains(attribute)
    .click()
    .get(VARIANTS_SELECTORS.nextButton)
    .click();
  fillUpPriceList(price);
  cy.get(`[name*='${warehouseId}']`)
    .click()
    .get(VARIANTS_SELECTORS.nextButton)
    .click()
    .get(VARIANTS_SELECTORS.skuInput)
    .type(sku);
  cy.addAliasToGraphRequest("ProductVariantBulkCreate");
  cy.get(VARIANTS_SELECTORS.nextButton).click();
  cy.wait("@ProductVariantBulkCreate");
  cy.get(SHARED_ELEMENTS.progressBar)
    .should("not.be.visible")
    .get(AVAILABLE_CHANNELS_FORM.menageChannelsButton)
    .should("be.visible");
}
export function createVariant({
  sku,
  warehouseName,
  attributeName,
  price,
  costPrice = price,
  channelName
}) {
  cy.get(PRODUCT_DETAILS.addVariantsButton)
    .click()
    .get(VARIANTS_SELECTORS.attributeSelector)
    .click()
    .get(VARIANTS_SELECTORS.attributeOption)
    .contains(attributeName)
    .click()
    .get(VARIANTS_SELECTORS.skuInputInAddVariant)
    .type(sku)
    .get(VARIANTS_SELECTORS.addWarehouseButton)
    .click();
  cy.contains(VARIANTS_SELECTORS.warehouseOption, warehouseName).click({
    force: true
  });
  cy.get(VARIANTS_SELECTORS.saveButton).click();
  cy.get(BUTTON_SELECTORS.back).click();
  selectChannelVariantInDetailsPage(channelName, attributeName);
  cy.get(BUTTON_SELECTORS.confirm).click();
  cy.contains(PRODUCT_DETAILS.variantRow, attributeName).click();
  cy.get(PRICE_LIST.priceInput)
    .type(price)
    .get(PRICE_LIST.costPriceInput)
    .type(costPrice);
  cy.addAliasToGraphRequest("ProductVariantChannelListingUpdate");
  cy.get(VARIANTS_SELECTORS.saveButton).click();
  cy.wait("@ProductVariantChannelListingUpdate");
  cy.get(BUTTON_SELECTORS.back)
    .click()
    .get(SHARED_ELEMENTS.progressBar)
    .should("not.be.visible")
    .get(AVAILABLE_CHANNELS_FORM.menageChannelsButton)
    .should("be.visible");
}
