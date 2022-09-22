/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { createCheckout } from "../../../support/api/requests/Checkout";
import { updateSale } from "../../../support/api/requests/Discounts/Sales";
import { createVariant } from "../../../support/api/requests/Product";
import * as channelsUtils from "../../../support/api/utils/channelsUtils";
import {
  createSaleInChannel,
  deleteSalesStartsWith,
} from "../../../support/api/utils/discounts/salesUtils";
import * as productsUtils from "../../../support/api/utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith,
} from "../../../support/api/utils/shippingUtils";
import { deleteWarehouseStartsWith } from "../../../support/api/utils/warehouseUtils";
import {
  createSaleWithNewVariant,
  discountOptions,
} from "../../../support/pages/discounts/salesPage";

describe("Sales discounts for variant", () => {
  const startsWith = "SalesVar-";
  const discountValue = 50;
  const productPrice = 100;

  let defaultChannel;
  let warehouse;
  let productData;
  let address;

  before(() => {
    const name = `${startsWith}${faker.datatype.number()}`;

    cy.clearSessionData().loginUserViaRequest();
    productsUtils.deleteProductsStartsWith(startsWith);
    deleteShippingStartsWith(startsWith);
    deleteSalesStartsWith(startsWith);
    deleteWarehouseStartsWith(startsWith);
    channelsUtils.getDefaultChannel().then(channel => {
      defaultChannel = channel;
    });
    cy.fixture("addresses")
      .then(addresses => {
        address = addresses.usAddress;

        createShipping({
          channelId: defaultChannel.id,
          address,
          name,
        });
      })
      .then(({ warehouse: warehouseResp }) => {
        warehouse = warehouseResp;
      });
    productsUtils
      .createTypeAttributeAndCategoryForProduct({
        name,
        attributeValues: ["value1", "value2"],
      })
      .then(({ attribute, category, productType }) => {
        productData = {
          attributeId: attribute.id,
          attributeName: attribute.name,
          categoryId: category.id,
          productTypeId: productType.id,
          channelId: defaultChannel.id,
          warehouseId: warehouse.id,
          price: productPrice,
        };
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should not be able see product variant discount not assigned to channel. TC: SALEOR_1804",
    { tags: ["@sales", "@allEnv", "@stable"] },
    () => {
      const saleName = `${startsWith}${faker.datatype.number()}`;
      const productPriceOnSale = productPrice - discountValue;

      let sale;
      let variantNotOnSale;

      createSaleInChannel({
        name: saleName,
        type: "FIXED",
        value: discountValue,
        channelId: defaultChannel.id,
      }).then(saleResp => (sale = saleResp));
      productsUtils
        .createProductInChannel(productData)
        .then(({ product, variantsList }) => {
          variantNotOnSale = variantsList;

          createVariant({
            productId: product.id,
            sku: saleName,
            attributeId: productData.attributeId,
            attributeName: "value2",
            warehouseId: warehouse.id,
            quantityInWarehouse: 10,
            channelId: defaultChannel.id,
            price: productPrice,
            weight: 10,
          });
        })
        .then(variantsList => {
          updateSale({ saleId: sale.id, variants: variantsList });
          createCheckout({
            channelSlug: defaultChannel.slug,
            email: "example@example.com",
            address,
            variantsList: variantsList.concat(variantNotOnSale),
          }).then(({ checkout }) => {
            const variantRespOnSale = checkout.lines[0].variant.pricing;
            const variantRespNotOnSale = checkout.lines[1].variant.pricing;

            expect(variantRespOnSale.onSale).to.be.true;
            expect(variantRespOnSale.price.gross.amount).to.eq(
              productPriceOnSale,
            );
            expect(variantRespNotOnSale.onSale).to.be.false;
            expect(variantRespNotOnSale.price.gross.amount).to.eq(
              productData.price,
            );
          });
        });
    },
  );

  it(
    "should be able to create percentage discount. TC: SALEOR_1807",
    { tags: ["@sales", "@allEnv", "@stable"] },
    () => {
      const saleName = `${startsWith}${faker.datatype.number()}`;
      const expectedPrice = (productPrice * discountValue) / 100;

      createSaleWithNewVariant({
        name: saleName,
        channel: defaultChannel,
        warehouseId: warehouse.id,
        productTypeId: productData.productTypeId,
        attributeId: productData.attributeId,
        categoryId: productData.categoryId,
        price: productPrice,
        discountOption: discountOptions.PERCENTAGE,
        discountValue,
      })
        .its("pricing.price.gross.amount")
        .should("eq", expectedPrice);
    },
  );

  it(
    "should be able to create fixed price discount. TC: SALEOR_1808",
    { tags: ["@sales", "@allEnv", "@stable"] },
    () => {
      const saleName = `${startsWith}${faker.datatype.number()}`;
      const expectedPrice = productPrice - discountValue;

      createSaleWithNewVariant({
        name: saleName,
        channel: defaultChannel,
        warehouseId: warehouse.id,
        productTypeId: productData.productTypeId,
        attributeId: productData.attributeId,
        categoryId: productData.categoryId,
        price: productPrice,
        discountOption: discountOptions.FIXED,
        discountValue,
      })
        .its("pricing.price.gross.amount")
        .should("eq", expectedPrice);
    },
  );
});
