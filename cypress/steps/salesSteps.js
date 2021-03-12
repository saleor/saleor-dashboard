import { ASSIGN_PRODUCTS_SELECTORS } from "../elements/catalog/assign-products";
import { MENAGE_CHANNEL_AVAILABILITY } from "../elements/channels/menage-channel-availability";
import { SALES_SELECTORS } from "../elements/discounts/sales";
import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";
import { formatDate } from "../support/formatDate";

export const discountOptions = {
  PERCENTAGE: SALES_SELECTORS.percentageOption,
  FIXED: SALES_SELECTORS.fixedOption
};

export function createSale({
  saleName,
  channelName,
  discountValue = 10,
  discountOption = discountOptions.PERCENTAGE
}) {
  const todaysDate = formatDate(new Date());

  cy.get(SALES_SELECTORS.createSaleButton)
    .click()
    .get(SALES_SELECTORS.nameInput)
    .type(saleName)
    .get(discountOption)
    .click()
    .get(MENAGE_CHANNEL_AVAILABILITY.availableManageButton)
    .click()
    .get(MENAGE_CHANNEL_AVAILABILITY.allChannelsInput)
    .click()
    .get(MENAGE_CHANNEL_AVAILABILITY.channelsAvailabilityForm)
    .contains(channelName)
    .click()
    .get(BUTTON_SELECTORS.submit)
    .click()
    .get(SALES_SELECTORS.discountValue)
    .type(discountValue)
    .get(SALES_SELECTORS.startDateInput)
    .type(todaysDate);
  cy.addAliasToGraphRequest("SaleCreate");
  cy.get(SALES_SELECTORS.saveButton).click();
  cy.wait("@SaleCreate");
}

export function assignProducts(productName) {
  cy.get(SALES_SELECTORS.productsTab)
    .click()
    .get(SALES_SELECTORS.assignProducts)
    .click()
    .get(ASSIGN_PRODUCTS_SELECTORS.searchInput)
    .type(productName);
  cy.contains(ASSIGN_PRODUCTS_SELECTORS.tableRow, productName)
    .find(BUTTON_SELECTORS.checkbox)
    .click();
  cy.addAliasToGraphRequest("SaleCataloguesAdd");
  cy.get(BUTTON_SELECTORS.submit).click();
  cy.wait("@SaleCataloguesAdd");
}
