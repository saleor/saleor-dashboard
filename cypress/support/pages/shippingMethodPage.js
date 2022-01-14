import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { SHIPPING_RATE_DETAILS } from "../../elements/shipping/shipping-rate-details";
import { SHIPPING_ZONE_DETAILS } from "../../elements/shipping/shipping-zone-details";
import { SHIPPING_ZONES_LIST } from "../../elements/shipping/shipping-zones-list";

export function createShippingZone(
  shippingName,
  warehouseName,
  country,
  channelName
) {
  cy.get(SHIPPING_ZONES_LIST.addShippingZone).click();
  fillUpShippingZoneData({
    shippingName,
    warehouseName,
    country,
    channelName
  });
}

export function fillUpShippingZoneData({
  shippingName,
  warehouseName,
  country,
  channelName
}) {
  cy.get(SHIPPING_ZONE_DETAILS.nameInput)
    .clearAndType(shippingName)
    .get(SHIPPING_ZONE_DETAILS.descriptionInput)
    .clearAndType(shippingName)
    .get(SHIPPING_ZONE_DETAILS.assignCountryButton)
    .click()
    .get(SHIPPING_ZONE_DETAILS.searchInput)
    .type(country);
  cy.contains(SHIPPING_ZONE_DETAILS.tableRow, country)
    .find(BUTTON_SELECTORS.checkbox)
    .click()
    .get(SHIPPING_ZONE_DETAILS.submitAssignCountry)
    .click()
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .confirmationMessageShouldDisappear()
    .get(SHIPPING_ZONE_DETAILS.warehouseSelector)
    .click()
    .get(SHIPPING_ZONE_DETAILS.warehouseSelector)
    .type(warehouseName)
    .get(SHIPPING_ZONE_DETAILS.autocompleteContentDialog)
    .scrollTo("bottom");
  return cy
    .contains(SHIPPING_ZONE_DETAILS.option, warehouseName)
    .click({ force: true })
    .get(SHIPPING_ZONE_DETAILS.channelSelector)
    .click()
    .get(SHIPPING_ZONE_DETAILS.option)
    .contains(channelName)
    .click()
    .addAliasToGraphRequest("UpdateShippingZone")
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .confirmationMessageShouldDisappear()
    .waitForRequestAndCheckIfNoErrors("@UpdateShippingZone");
}

export function changeWeightUnit(weightUnit) {
  cy.fillBaseSelect(SHIPPING_ZONES_LIST.unitSelect, weightUnit)
    .addAliasToGraphRequest("UpdateDefaultWeightUnit")
    .get(SHIPPING_ZONES_LIST.saveUnit)
    .click()
    .confirmationMessageShouldDisappear()
    .waitForRequestAndCheckIfNoErrors("@UpdateDefaultWeightUnit")
    .wait(5000);
}

export function createShippingRate({
  rateName,
  price,
  rateOption,
  weightLimits,
  deliveryTime
}) {
  enterAndFillUpShippingRate({
    rateName,
    price,
    rateOption,
    weightLimits,
    deliveryTime
  });
  return saveRate();
}

export function enterAndFillUpShippingRate({
  rateName,
  price,
  rateOption,
  weightLimits,
  deliveryTime
}) {
  cy.get(rateOption).click();
  fillUpShippingRate({
    rateName,
    price,
    weightLimits,
    deliveryTime
  });
}

export function fillUpShippingRate({
  rateName,
  price,
  weightLimits,
  deliveryTime
}) {
  cy.waitForProgressBarToNotBeVisible()
    .get(SHARED_ELEMENTS.richTextEditor.empty)
    .should("exist")
    .get(SHIPPING_RATE_DETAILS.inputName)
    .clearAndType(rateName);
  if (deliveryTime) {
    fillUpDeliveryTime(deliveryTime);
  }
  if (weightLimits) {
    fillUpWeightLimits(weightLimits);
  }
  cy.get(SHIPPING_RATE_DETAILS.priceInput).each($priceInput => {
    cy.wrap($priceInput).clearAndType(price);
  });
}

export function createRateWithPostalCode({
  rateName,
  price,
  rateOption = rateOptions.PRICE_OPTION,
  minPostalCode,
  maxPostalCode,
  postalCodeOption
}) {
  enterAndFillUpShippingRate({ rateName, price, rateOption });
  cy.get(postalCodeOption)
    .click()
    .get(SHIPPING_RATE_DETAILS.addPostalCodesButton)
    .click()
    .get(SHIPPING_RATE_DETAILS.postalCodesForm.min)
    .type(minPostalCode)
    .get(SHIPPING_RATE_DETAILS.postalCodesForm.max)
    .type(maxPostalCode)
    .get(BUTTON_SELECTORS.submit)
    .click();
  return saveRate();
}

export function saveRate() {
  return cy
    .addAliasToGraphRequest("ShippingMethodChannelListingUpdate")
    .addAliasToGraphRequest("ShippingZone")
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .confirmationMessageShouldDisappear()
    .waitForRequestAndCheckIfNoErrors(`@ShippingMethodChannelListingUpdate`)
    .waitForRequestAndCheckIfNoErrors(`@ShippingZone`)
    .its("response.body.0.data.shippingZone");
}

export function saveRateAfterUpdate() {
  return cy
    .addAliasToGraphRequest("ShippingMethodChannelListingUpdate")
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .confirmationMessageShouldDisappear()
    .waitForRequestAndCheckIfNoErrors(`@ShippingMethodChannelListingUpdate`);
}

export function fillUpWeightLimits({ max, min }) {
  cy.get(SHIPPING_RATE_DETAILS.minWeightInput)
    .type(min)
    .get(SHIPPING_RATE_DETAILS.maxWeightInput)
    .type(max);
}

export function fillUpDeliveryTime({ min, max }) {
  cy.get(SHIPPING_RATE_DETAILS.minDeliveryTimeInput)
    .clearAndType(min)
    .get(SHIPPING_RATE_DETAILS.maxDeliveryTimeInput)
    .clearAndType(max);
}

export const rateOptions = {
  PRICE_OPTION: SHIPPING_ZONE_DETAILS.addPriceRateButton,
  WEIGHT_OPTION: SHIPPING_ZONE_DETAILS.addWeightRateButton
};

export const postalCodesOptions = {
  INCLUDE_OPTION: SHIPPING_RATE_DETAILS.includePostalCodesCheckbox,
  EXCLUDE_OPTION: SHIPPING_RATE_DETAILS.excludePostalCodesCheckbox
};
