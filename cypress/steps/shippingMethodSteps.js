import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../elements/shared/sharedElements";
import { SHIPPING_RATE_DETAILS } from "../elements/shipping/shipping-rate-details";
import { SHIPPING_ZONE_DETAILS } from "../elements/shipping/shipping-zone-details";
import { SHIPPING_ZONES_LIST } from "../elements/shipping/shipping-zones-list";

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
    .click()
    .get(SHIPPING_ZONE_DETAILS.warehouseSelector)
    .click()
    .get(SHIPPING_ZONE_DETAILS.option)
    .contains(warehouseName)
    .click()
    .get(SHIPPING_ZONE_DETAILS.channelSelector)
    .click()
    .get(SHIPPING_ZONE_DETAILS.option)
    .contains(channelName)
    .click();
  cy.addAliasToGraphRequest("UpdateShippingZone");
  cy.get(BUTTON_SELECTORS.confirm).click();
  cy.wait("@UpdateShippingZone");
}

export function createShippingRate(rateName, price, rateOption) {
  cy.get(rateOption)
    .click()
    .get(SHARED_ELEMENTS.progressBar)
    .should("not.be.visible")
    .get(SHIPPING_RATE_DETAILS.inputName)
    .type(rateName)
    .get(SHIPPING_RATE_DETAILS.priceInput)
    .each($priceInput => {
      cy.wrap($priceInput).type(price);
    });
  cy.addAliasToGraphRequest("ShippingZone");
  cy.get(BUTTON_SELECTORS.confirm).click();
  cy.wait("@ShippingZone");
}

export const rateOptions = {
  PRICE_OPTION: SHIPPING_ZONE_DETAILS.addPriceRateButton,
  WEIGHT_OPTION: SHIPPING_ZONE_DETAILS.addWeightRateButton
};
