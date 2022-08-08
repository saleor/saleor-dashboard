import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SITE_SETTINGS_DETAILS } from "../../elements/siteSettings/site-settings-details";
import { urlList } from "../../fixtures/urlList";

export function enterSiteSettingAndSetStockReservation(userType, stockAmount) {
  cy.visitAndWaitForProgressBarToDisappear(urlList.siteSettings);
  if (stockAmount) {
    cy.get(userType).clearAndType(stockAmount);
  } else {
    cy.get(userType).clear();
  }
  cy.addAliasToGraphRequest("ShopSettingsUpdate")
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .waitForRequestAndCheckIfNoErrors("@ShopSettingsUpdate");
}

export const userType = {
  anonymous: SITE_SETTINGS_DETAILS.stockReservationAnonymousUserInput,
  authenticated: SITE_SETTINGS_DETAILS.stockReservationAuthenticatedUserInput,
};
