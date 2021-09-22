import { SALES_SELECTORS } from "../../../elements/discounts/sales";
import { ASSIGN_ELEMENTS_SELECTORS } from "../../../elements/shared/assign-elements-selectors";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { formatDate } from "../../../support/formatData/formatDate";
import { selectChannelInDetailsPages } from "../channelsPage";

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
    .waitForProgressBarToNotBeVisible()
    .get(SALES_SELECTORS.nameInput)
    .type(saleName)
    .get(discountOption)
    .click();
  selectChannelInDetailsPages(channelName);
  cy.get(SALES_SELECTORS.discountValue)
    .type(discountValue)
    .get(SALES_SELECTORS.startDateInput)
    .type(todaysDate)
    .addAliasToGraphRequest("SaleCreate")
    .get(SALES_SELECTORS.saveButton)
    .click()
    .confirmationMessageShouldDisappear()
    .waitForRequestAndCheckIfNoErrors("@SaleCreate");
}

export function assignProducts(productName) {
  cy.waitForProgressBarToNotBeVisible()
    .get(SALES_SELECTORS.productsTab)
    .click()
    .get(SALES_SELECTORS.assignProducts)
    .click()
    .get(ASSIGN_ELEMENTS_SELECTORS.searchInput)
    .type(productName);
  cy.contains(ASSIGN_ELEMENTS_SELECTORS.productTableRow, productName)
    .find(ASSIGN_ELEMENTS_SELECTORS.checkbox)
    .click();
  cy.addAliasToGraphRequest("SaleCataloguesAdd");
  cy.get(BUTTON_SELECTORS.submit).click();
  cy.waitForRequestAndCheckIfNoErrors("@SaleCataloguesAdd");
}
