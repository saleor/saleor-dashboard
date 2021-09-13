import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../elements/shared/sharedElements";
import { SHIPPING_RATE_DETAILS } from "../elements/shipping/shipping-rate-details";
import { SHIPPING_ZONE_DETAILS } from "../elements/shipping/shipping-zone-details";
import { SHIPPING_ZONES_LIST } from "../elements/shipping/shipping-zones-list";
import { confirmationMessageShouldDisappear } from "./shared/confirmationMessages";
import { waitForProgressBarToNotBeVisible } from "./shared/progressBar";
import { fillBaseSelect } from "./shared/selects";

export function createShippingZone(
  shippingName,
  warehouseName,
  country,
  channelName
) {
  cy.get(SHIPPING_ZONES_LIST.addShippingZone)
    .click()
    .get(SHIPPING_ZONE_DETAILS.nameInput)
    .type(shippingName)
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
    .click();
  confirmationMessageShouldDisappear();
  cy.get(SHIPPING_ZONE_DETAILS.warehouseSelector)
    .click()
    .get(SHIPPING_ZONE_DETAILS.autocompleteContentDialog)
    .scrollTo("bottom")
    // Remove this code between comments after fixing bug: SALEOR-3611
    .get(SHIPPING_ZONE_DETAILS.autocompleteContentDialog)
    .should("not.exist")
    .get(SHIPPING_ZONE_DETAILS.warehouseSelector)
    .click()
    // Remove this code between comments after fixing bug: SALEOR-3611
    .get(SHIPPING_ZONE_DETAILS.option)
    .contains(warehouseName)
    .click({ force: true })
    .get(SHIPPING_ZONE_DETAILS.channelSelector)
    .click()
    .get(SHIPPING_ZONE_DETAILS.option)
    .contains(channelName)
    .click();
  cy.addAliasToGraphRequest("UpdateShippingZone");
  cy.get(BUTTON_SELECTORS.confirm).click();
  confirmationMessageShouldDisappear();
  cy.wait("@UpdateShippingZone");
}

export function changeWeightUnit(weightUnit) {
  fillBaseSelect(SHIPPING_ZONES_LIST.unitSelect, weightUnit);
  cy.addAliasToGraphRequest("UpdateDefaultWeightUnit");
  cy.get(SHIPPING_ZONES_LIST.saveUnit).click();
  confirmationMessageShouldDisappear();
  cy.wait("@UpdateDefaultWeightUnit").wait(5000);
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
  waitForProgressBarToNotBeVisible();
  cy.get(SHARED_ELEMENTS.richTextEditor.empty)
    .should("exist")
    .get(SHIPPING_RATE_DETAILS.inputName)
    .type(rateName);
  if (deliveryTime) {
    fillUpDeliveryTime(deliveryTime);
  }
  if (weightLimits) {
    fillUpWeightLimits(weightLimits);
  }
  cy.get(SHIPPING_RATE_DETAILS.priceInput).each($priceInput => {
    cy.wrap($priceInput).type(price);
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
  cy.addAliasToGraphRequest("ShippingMethodChannelListingUpdate")
    .addAliasToGraphRequest("ShippingZone")
    .get(BUTTON_SELECTORS.confirm)
    .click();
  confirmationMessageShouldDisappear();
  return cy
    .wait(`@ShippingMethodChannelListingUpdate`)
    .wait(`@ShippingZone`)
    .its("response.body.0.data.shippingZone");
}

export function fillUpWeightLimits({ max, min }) {
  cy.get(SHIPPING_RATE_DETAILS.minWeightInput)
    .type(min)
    .get(SHIPPING_RATE_DETAILS.maxWeightInput)
    .type(max);
}

export function fillUpDeliveryTime({ min, max }) {
  cy.get(SHIPPING_RATE_DETAILS.minDeliveryTimeInput)
    .type(min)
    .get(SHIPPING_RATE_DETAILS.maxDeliveryTimeInput)
    .type(max);
}

export const rateOptions = {
  PRICE_OPTION: SHIPPING_ZONE_DETAILS.addPriceRateButton,
  WEIGHT_OPTION: SHIPPING_ZONE_DETAILS.addWeightRateButton
};

export const postalCodesOptions = {
  INCLUDE_OPTION: SHIPPING_RATE_DETAILS.includePostalCodesCheckbox,
  EXCLUDE_OPTION: SHIPPING_RATE_DETAILS.excludePostalCodesCheckbox
};
