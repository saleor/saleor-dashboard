import { PRICE_LIST } from "../../../../elements/catalog/products/price-list";
import { PRODUCT_DETAILS } from "../../../../elements/catalog/products/product-details";
import { VARIANTS_SELECTORS } from "../../../../elements/catalog/products/variants-selectors";
import { AVAILABLE_CHANNELS_FORM } from "../../../../elements/channels/available-channels-form";
import { BUTTON_SELECTORS } from "../../../../elements/shared/button-selectors";
import { updateVariantWarehouse } from "../../../../support/api/requests/Product";
import { formatDate } from "../../../formatData/formatDate";
import { selectChannelVariantInDetailsPage } from "../../channelsPage";

export function variantsShouldBeVisible({ price }) {
  cy.get(PRODUCT_DETAILS.variantRow).should("be.visible");
  cy.contains(PRODUCT_DETAILS.variantPrice, price);
}

export function createVariant({
  sku,
  warehouseName,
  warehouseId,
  attributeName,
  price,
  costPrice = price,
  quantity = 10,
  variantName,
}) {
  fillUpVariantDetails({
    attributeName,
    sku,
    warehouseName,
    warehouseId,
    quantity,
    costPrice,
    price,
    variantName,
  });
  cy.get(VARIANTS_SELECTORS.saveButton)
    .click()
    .get(VARIANTS_SELECTORS.skuTextField)
    .should("be.enabled")
    .get(BUTTON_SELECTORS.back)
    .click()
    .get(PRODUCT_DETAILS.productNameInput)
    .should("be.enabled");
}

export function fillUpGeneralVariantInputs({
  attributeName,
  warehouseName,
  sku,
  quantity,
}) {
  fillUpVariantAttributeAndSku({ attributeName, sku });
  cy.get(VARIANTS_SELECTORS.addWarehouseButton).click();
  if (warehouseName) {
    cy.contains(VARIANTS_SELECTORS.warehouseOption, warehouseName).click({
      force: true,
    });
  } else {
    cy.get(VARIANTS_SELECTORS.warehouseOption).first().click({ force: true });
  }
  cy.get(VARIANTS_SELECTORS.stockInput).type(quantity);
}

export function fillUpVariantDetails({
  attributeName,
  attributeType = "DROPDOWN",
  sku,
  warehouseName,
  warehouseId,
  quantity,
  costPrice,
  price,
  variantName,
}) {
  if (variantName) {
    cy.get(VARIANTS_SELECTORS.variantNameInput).type(variantName, {
      force: true,
    });
  }
  selectAttributeWithType({ attributeType, attributeName });

  cy.get(PRICE_LIST.priceInput)
    .each(input => {
      cy.wrap(input).type(price, { force: true });
    })
    .get(PRICE_LIST.costPriceInput)
    .each(input => {
      cy.wrap(input).type(costPrice, { force: true });
    });
  if (sku) {
    cy.get(VARIANTS_SELECTORS.skuTextField).click({ force: true }).type(sku);
  }
  if (warehouseName) {
    cy.get(VARIANTS_SELECTORS.addWarehouseButton).click();
    cy.contains(VARIANTS_SELECTORS.warehouseOption, warehouseName)
      .click({
        force: true,
      })
      .get(VARIANTS_SELECTORS.stockInput)
      .type(quantity);
  }
  if (warehouseId) {
    saveVariant().then(({ response }) => {
      const variantId =
        response.body.data.productVariantCreate.productVariant.id;
      updateVariantWarehouse({ variantId, warehouseId, quantity });
    });
  }
  cy.get(VARIANTS_SELECTORS.saveButton).click();
}

export function fillUpVariantAttributeAndSku({ attributeName, sku }) {
  cy.get(VARIANTS_SELECTORS.attributeSelector)
    .click()
    .get(VARIANTS_SELECTORS.attributeOption)
    .contains(attributeName)
    .click();
  if (sku) {
    cy.get(VARIANTS_SELECTORS.skuTextField).click({ force: true }).type(sku);
  }
}

export function selectChannelForVariantAndFillUpPrices({
  channelName,
  variantName,
  price,
  costPrice = price,
}) {
  cy.waitForProgressBarToNotBeVisible().addAliasToGraphRequest(
    "ProductChannelListingUpdate",
  );
  selectChannelVariantInDetailsPage(channelName, variantName);
  cy.get(BUTTON_SELECTORS.confirm)
    .click()
    .waitForRequestAndCheckIfNoErrors("@ProductChannelListingUpdate");
  cy.contains(PRODUCT_DETAILS.variantRow, variantName)
    .click()
    .get(PRICE_LIST.priceInput)
    .each(input => {
      cy.wrap(input).type(price);
    })
    .get(PRICE_LIST.costPriceInput)
    .each(input => {
      cy.wrap(input).type(costPrice);
    })
    .addAliasToGraphRequest("ProductVariantChannelListingUpdate")
    .get(VARIANTS_SELECTORS.saveButton)
    .click()
    .waitForRequestAndCheckIfNoErrors("@ProductVariantChannelListingUpdate")
    .get(PRICE_LIST.priceInput)
    .should("be.enabled")
    .get(BUTTON_SELECTORS.back)
    .click()
    .waitForProgressBarToNotBeVisible()
    .get(AVAILABLE_CHANNELS_FORM.manageChannelsButton)
    .should("be.visible");
}

export function selectOptionsAttribute(attributeName) {
  cy.get(VARIANTS_SELECTORS.attributeSelector)
    .click()
    .get(VARIANTS_SELECTORS.attributeOption)
    .contains(attributeName)
    .click();
}

export function selectBooleanAttributeToTrue() {
  cy.get(VARIANTS_SELECTORS.attributeSelector).first().click();
}

export function selectDateAttribute() {
  cy.get(VARIANTS_SELECTORS.attributeSelector)
    .first()
    .find("input")
    .type(formatDate(new Date()));
}

export function selectNumericAttribute(numeric) {
  cy.get(VARIANTS_SELECTORS.attributeSelector).first().type(numeric);
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

export function saveVariant(waitForAlias = "VariantCreate") {
  return cy
    .addAliasToGraphRequest(waitForAlias)
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .waitForRequestAndCheckIfNoErrors(`@${waitForAlias}`);
}

export function selectChannelsForVariant() {
  cy.get(VARIANTS_SELECTORS.manageChannels)
    .click()
    .get(VARIANTS_SELECTORS.allChannels)
    .check()
    .get(BUTTON_SELECTORS.submit)
    .click();
}
