/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { SALES_SELECTORS } from "../../../elements/discounts/sales";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import { saleDetailsUrl } from "../../../fixtures/urlList";
import { updateSale } from "../../../support/api/requests/Discounts/Sales";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import {
  createSaleInChannel,
  createSaleInChannelWithProduct,
  deleteSalesStartsWith,
  getVariantWithSaleStatus,
} from "../../../support/api/utils/discounts/salesUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith,
} from "../../../support/api/utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith,
} from "../../../support/api/utils/shippingUtils";
import {
  getDefaultTaxClass,
  updateTaxConfigurationForChannel,
} from "../../../support/api/utils/taxesUtils";

describe("As an admin I want to update sales", () => {
  const startsWith = "CySales";
  const discountValue = 10;
  const productPrice = 30;
  const productPriceOnSale = productPrice - discountValue;

  let defaultChannel;
  let sale;
  let warehouse;
  let address;
  let productData;
  let variants;
  let taxClass;

  before(() => {
    const name = `${startsWith}${faker.datatype.number()}`;

    cy.loginUserViaRequest();
    deleteProductsStartsWith(startsWith);
    deleteShippingStartsWith(startsWith);
    deleteSalesStartsWith(startsWith);
    getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        getDefaultTaxClass();
      })
      .then(taxResp => {
        taxClass = taxResp;
        createSaleInChannel({
          name,
          type: "FIXED",
          value: discountValue,
          channelId: defaultChannel.id,
        });
      })
      .then(saleResp => (sale = saleResp));
    cy.fixture("addresses")
      .then(addresses => {
        address = addresses.usAddress;

        createShipping({
          channelId: defaultChannel.id,
          address,
          name: startsWith,
          taxClassId: taxClass.id,
        });
      })
      .then(({ warehouse: warehouseResp }) => {
        warehouse = warehouseResp;
      });
    createTypeAttributeAndCategoryForProduct({
      name,
      attributeValues: ["value1", "value2"],
    }).then(({ attribute, category, productType }) => {
      productData = {
        attributeId: attribute.id,
        categoryId: category.id,
        productTypeId: productType.id,
        channelId: defaultChannel.id,
        warehouseId: warehouse.id,
        price: productPrice,
        taxClassId: taxClass.id,
      };
      cy.checkIfDataAreNotNull({
        productData,
        defaultChannel,
        warehouse,
        address,
        sale,
        variants,
      });
    });
  });

  beforeEach(() => {
    cy.loginUserViaRequest();
    updateTaxConfigurationForChannel({
      channelSlug: defaultChannel.slug,
      pricesEnteredWithTax: true,
    });
  });

  it(
    "should be able to delete sale. TC: SALEOR_1805",
    { tags: ["@sales", "@allEnv", "@stable"] },
    () => {
      const productName = `${startsWith}${faker.datatype.number()}`;
      const productSku = `${startsWith}${faker.datatype.number()}`;

      productData.name = productName;
      productData.sku = productSku;

      createProductInChannel(productData)
        .then(({ variantsList }) => {
          variants = variantsList;

          createSaleInChannelWithProduct({
            name: productName,
            type: "FIXED",
            value: discountValue,
            channelId: defaultChannel.id,
            variants,
          });
        })
        .then(saleResp => {
          getVariantWithSaleStatus({
            channelSlug: defaultChannel.slug,
            variantId: variants[0].id,
            onSaleStatus: true,
          })
            .its("pricing")
            .its("price.gross.amount")
            .should("eq", productPriceOnSale);
          cy.visit(saleDetailsUrl(saleResp.id))
            .addAliasToGraphRequest("SaleDelete")
            .get(BUTTON_SELECTORS.deleteButton)
            .click()
            .get(BUTTON_SELECTORS.submit)
            .click()
            .wait("@SaleDelete");
          getVariantWithSaleStatus({
            channelSlug: defaultChannel.slug,
            variantId: variants[0].id,
            onSaleStatus: false,
          })
            .its("pricing")
            .its("price.gross.amount")
            .should("eq", productPrice);
        });
    },
  );

  it(
    "should be able to remove variant from sale. TC: SALEOR_1806",
    { tags: ["@sales", "@allEnv", "@stable"] },
    () => {
      const productName = `${startsWith}${faker.datatype.number()}`;

      let product;
      productData.name = productName;
      productData.sku = productName;

      createProductInChannel(productData).then(
        ({ variantsList, product: productResp }) => {
          product = productResp;
          variants = variantsList;

          updateSale({
            saleId: sale.id,
            variants,
          });
          getVariantWithSaleStatus({
            channelSlug: defaultChannel.slug,
            variantId: variants[0].id,
            onSaleStatus: true,
          })
            .its("pricing")
            .its("price.gross.amount")
            .should("eq", productPriceOnSale);
          cy.visit(saleDetailsUrl(sale.id))
            .get(SALES_SELECTORS.variantsTab)
            .click()
            .addAliasToGraphRequest("SaleCataloguesRemove");
          cy.contains(SHARED_ELEMENTS.tableRow, product.name)
            .find(BUTTON_SELECTORS.button)
            .click()
            .get(BUTTON_SELECTORS.submit)
            .click()
            .wait("@SaleCataloguesRemove");
          getVariantWithSaleStatus({
            channelSlug: defaultChannel.slug,
            variantId: variants[0].id,
            onSaleStatus: false,
          })
            .its("pricing")
            .its("price.gross.amount")
            .should("eq", productPrice);
        },
      );
    },
  );
});
