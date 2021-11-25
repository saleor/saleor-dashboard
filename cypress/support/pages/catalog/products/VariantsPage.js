import { PRICE_LIST } from "../../../../elements/catalog/products/price-list";
import { PRODUCT_DETAILS } from "../../../../elements/catalog/products/product-details";
import { VARIANTS_SELECTORS } from "../../../../elements/catalog/products/variants-selectors";
import { AVAILABLE_CHANNELS_FORM } from "../../../../elements/channels/available-channels-form";
import { BUTTON_SELECTORS } from "../../../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../../../elements/shared/sharedElements";
import { formatDate } from "../../../formatData/formatDate";
import { selectChannelVariantInDetailsPage } from "../../channelsPage";
import { fillUpPriceList } from "./priceListComponent";

export function variantsShouldBeVisible({ price }) {
  cy.get(PRODUCT_DETAILS.variantRow).should("be.visible");
  cy.contains(PRODUCT_DETAILS.variantPrice, price);
}

export function createFirstVariant({
  sku,
  warehouseId,
  price,
  attribute,
  quantity = 1
}) {
  cy.get(PRODUCT_DETAILS.addVariantsButton).click();
  cy.get(PRODUCT_DETAILS.addVariantsOptionDialog.optionMultiple).click();
  cy.get(BUTTON_SELECTORS.submit).click();
  cy.get(VARIANTS_SELECTORS.valueContainer)
    .click()
    .contains(attribute)
    .click()
    .get(VARIANTS_SELECTORS.nextButton)
    .click();
  fillUpPriceList(price);
  cy.get(`[name*='${warehouseId}']`)
    .click()
    .get(VARIANTS_SELECTORS.stockInput)
    .type(quantity)
    .get(VARIANTS_SELECTORS.nextButton)
    .click();
  if (sku) {
    cy.get(VARIANTS_SELECTORS.skuInput).type(sku);
  }
  cy.addAliasToGraphRequest("ProductVariantBulkCreate")
    .get(VARIANTS_SELECTORS.nextButton)
    .click()
    .waitForRequestAndCheckIfNoErrors("@ProductVariantBulkCreate")
    .waitForProgressBarToNotBeVisible()
    .get(AVAILABLE_CHANNELS_FORM.menageChannelsButton)
    .should("be.visible");
}

export function createVariant({
  sku,
  warehouseName,
  attributeName,
  price,
  costPrice = price,
  channelName,
  quantity = 10
}) {
  cy.get(PRODUCT_DETAILS.addVariantsButton).click();
  fillUpVariantDetails({ attributeName, sku, warehouseName, quantity });
  cy.get(BUTTON_SELECTORS.back)
    .click()
    .addAliasToGraphRequest("ProductChannelListingUpdate");
  selectChannelVariantInDetailsPage(channelName, attributeName);
  cy.get(BUTTON_SELECTORS.confirm)
    .click()
    .waitForRequestAndCheckIfNoErrors("@ProductChannelListingUpdate");
  cy.contains(PRODUCT_DETAILS.variantRow, attributeName)
    .click()
    .get(PRICE_LIST.priceInput)
    .type(price)
    .get(PRICE_LIST.costPriceInput)
    .type(costPrice)
    .addAliasToGraphRequest("ProductVariantChannelListingUpdate")
    .get(VARIANTS_SELECTORS.saveButton)
    .click()
    .waitForRequestAndCheckIfNoErrors("@ProductVariantChannelListingUpdate")
    .get(BUTTON_SELECTORS.back)
    .click()
    .waitForProgressBarToNotBeVisible()
    .get(AVAILABLE_CHANNELS_FORM.menageChannelsButton)
    .should("be.visible");
}

export function fillUpVariantDetails({
  attributeName,
  attributeType = "DROPDOWN",
  sku,
  warehouseName,
  quantity
}) {
  selectAttributeWithType({ attributeType, attributeName });
  if (sku) {
    cy.get(VARIANTS_SELECTORS.skuInputInAddVariant).type(sku);
  }
  if (warehouseName) {
    cy.get(VARIANTS_SELECTORS.addWarehouseButton).click();
    cy.contains(VARIANTS_SELECTORS.warehouseOption, warehouseName)
      .click({
        force: true
      })
      .get(VARIANTS_SELECTORS.stockInput)
      .type(quantity);
  }
  cy.get(VARIANTS_SELECTORS.saveButton).click();
}

export function selectOptionsAttribute(attributeName) {
  cy.get(VARIANTS_SELECTORS.attributeSelector)
    .click()
    .get(VARIANTS_SELECTORS.attributeOption)
    .contains(attributeName)
    .click();
}

export function selectBooleanAttributeToTrue() {
  cy.get(VARIANTS_SELECTORS.booleanAttributeCheckbox).click();
}

export function selectDateAttribute() {
  cy.get(VARIANTS_SELECTORS.attributeSelector)
    .find("input")
    .type(formatDate(new Date()));
}

export function selectNumericAttribute(numeric) {
  cy.get(VARIANTS_SELECTORS.attributeSelector).type(numeric);
}

export function selectAttributeWithType({ attributeType, attributeName }) {
  switch (attributeType) {
    case "DATE":
      selectDateAttribute();
      break;
    case "BOOLEAN":
      selectBooleanAttributeToTrue();
      break;
    case "NUMERIC":
      selectNumericAttribute(attributeName);
      break;
    default:
      selectOptionsAttribute(attributeName);
  }
}
