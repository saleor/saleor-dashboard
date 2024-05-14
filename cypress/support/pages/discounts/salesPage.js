import { SHARED_ELEMENTS } from "../../../elements";
import { SALES_SELECTORS } from "../../../elements/discounts/sales";
import { ASSIGN_ELEMENTS_SELECTORS } from "../../../elements/shared/assign-elements-selectors";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { urlList } from "../../../fixtures/urlList";
import { getVariantWithSaleStatus } from "../../../support/api/utils/discounts/salesUtils";
import { formatDate } from "../../../support/formatData/formatDate";
import { getVariant } from "../../api/requests/Product";
import { expectProductVisibleInShop } from "../../api/requests/storeFront/Search";
import { createProductInChannel } from "../../api/utils/products/productsUtils";
import { getProductPrice } from "../../api/utils/storeFront/storeFrontProductUtils";
import { selectChannelInDetailsPages } from "../channelsPage";

export const discountOptions = {
  PERCENTAGE: SALES_SELECTORS.percentageOption,
  FIXED: SALES_SELECTORS.fixedOption,
};

export function createSale({
  saleName,
  channelName,
  discountValue = 10,
  discountOption = discountOptions.PERCENTAGE,
}) {
  const todaysDate = formatDate(new Date());

  cy.get(SALES_SELECTORS.createSaleButton)
    .click()
    .get(SALES_SELECTORS.nameInput)
    .type(saleName)
    .get(discountOption)
    .click();
  selectChannelInDetailsPages(channelName);

  return cy
    .get(SALES_SELECTORS.discountValue)
    .type(discountValue)
    .get(SALES_SELECTORS.startDateInput)
    .type(todaysDate)
    .addAliasToGraphRequest("SaleCreate")
    .get(SALES_SELECTORS.saveButton)
    .click()
    .waitForRequestAndCheckIfNoErrors("@SaleCreate")
    .get(SHARED_ELEMENTS.notificationMessage)
    .should("contain", "Successfully created sale");
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
  cy.get(SHARED_ELEMENTS.notificationMessage).should(
    "contain",
    "Saved changes",
  );
}

export function assignVariants(productName, variantName) {
  cy.waitForProgressBarToNotBeVisible()
    .get(SALES_SELECTORS.variantsTab)
    .click()
    .get(SALES_SELECTORS.assignVariants)
    .click()
    .get(ASSIGN_ELEMENTS_SELECTORS.searchInput)
    .type(productName)
    .get(ASSIGN_ELEMENTS_SELECTORS.variantTableRow)
    .should("have.length", 1);
  cy.contains(ASSIGN_ELEMENTS_SELECTORS.variantTableRow, variantName)
    .find(ASSIGN_ELEMENTS_SELECTORS.checkbox)
    .click();
  cy.addAliasToGraphRequest("SaleCataloguesAdd");
  cy.get(BUTTON_SELECTORS.submit).click();
  cy.waitForRequestAndCheckIfNoErrors("@SaleCataloguesAdd");
}

export function createSaleWithNewProduct({
  name,
  channel,
  warehouseId,
  productTypeId,
  attributeId,
  categoryId,
  price,
  discountOption,
  discountValue,
  taxClassId,
}) {
  return createProductInChannel({
    name,
    channelId: channel.id,
    warehouseId,
    productTypeId,
    attributeId,
    categoryId,
    price,
    taxClassId,
  }).then(({ product: productResp, variantsList }) => {
    const product = productResp;

    /* Uncomment after fixing SALEOR-3367 bug
       cy.clearSessionData()
      .loginUserViaRequest("auth", ONE_PERMISSION_USERS.discount) 
      */
    cy.visit(urlList.sales);
    createSale({
      saleName: name,
      channelName: channel.name,
      discountValue,
      discountOption,
    });

    // Make sure the product is searchable before assigning
    expectProductVisibleInShop(product.name);
    assignProducts(product.name);
    // Wait until product variant receives onSale status
    getVariantWithSaleStatus({
      variantId: variantsList[0].id,
      channelSlug: channel.slug,
      onSaleStatus: true,
    });

    return getProductPrice(product.id, channel.slug);
  });
}

export function createSaleWithNewVariant({
  name,
  channel,
  warehouseId,
  productTypeId,
  attributeId,
  categoryId,
  price,
  discountValue,
  discountOption,
}) {
  return createProductInChannel({
    name,
    channelId: channel.id,
    warehouseId,
    productTypeId,
    attributeId,
    categoryId,
    price,
  }).then(({ variantsList: variantsListResp, product }) => {
    const variant = variantsListResp[0];
    /* Uncomment after fixing SALEOR-3367 bug
       cy.clearSessionData()
      .loginUserViaRequest("auth", ONE_PERMISSION_USERS.discount) 
      */
    cy.visit(urlList.sales);
    createSale({
      saleName: name,
      channelName: channel.name,
      discountValue,
      discountOption,
    });
    assignVariants(product.name, variant.name);
    getVariantWithSaleStatus({
      channelSlug: channel.slug,
      variantId: variant.id,
      onSaleStatus: true,
    });
    return getVariant(variant.id, channel.slug, "token");
  });
}
