/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import * as channelsUtils from "../../support/api/utils/channelsUtils";
import { deleteSalesStartsWith } from "../../support/api/utils/discounts/salesUtils";
import * as productsUtils from "../../support/api/utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../support/api/utils/shippingUtils";
import filterTests from "../../support/filterTests";
import {
  createSaleWithNewVariant,
  discountOptions
} from "../../support/pages/discounts/salesPage";

filterTests({ definedTags: ["all"] }, () => {
  describe("Sales discounts for variant", () => {
    const startsWith = "CySales-";

    let productType;
    let attribute;
    let category;
    let defaultChannel;
    let warehouse;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteSalesStartsWith(startsWith);
      productsUtils.deleteProductsStartsWith(startsWith);
      deleteShippingStartsWith(startsWith);

      const name = `${startsWith}${faker.datatype.number()}`;
      productsUtils
        .createTypeAttributeAndCategoryForProduct({ name })
        .then(
          ({
            productType: productTypeResp,
            attribute: attributeResp,
            category: categoryResp
          }) => {
            productType = productTypeResp;
            attribute = attributeResp;
            category = categoryResp;

            channelsUtils.getDefaultChannel();
          }
        )
        .then(channel => {
          defaultChannel = channel;
          cy.fixture("addresses");
        })
        .then(addresses => {
          createShipping({
            channelId: defaultChannel.id,
            name,
            address: addresses.plAddress,
            price: 100
          });
        })
        .then(({ warehouse: warehouseResp }) => {
          warehouse = warehouseResp;
        });
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
    });

    it("should create percentage discount", () => {
      const saleName = `${startsWith}${faker.datatype.number()}`;
      const discountValue = 50;
      const productPrice = 100;

      createSaleWithNewVariant({
        name: saleName,
        channel: defaultChannel,
        warehouseId: warehouse.id,
        productTypeId: productType.id,
        attributeId: attribute.id,
        categoryId: category.id,
        price: productPrice,
        discountOption: discountOptions.PERCENTAGE,
        discountValue
      }).then(({ pricing }) => {
        const priceInResponse = pricing.price.gross.amount;
        const expectedPrice = (productPrice * discountValue) / 100;
        expect(expectedPrice).to.be.eq(priceInResponse);
      });
    });

    it("should create fixed price discount", () => {
      const saleName = `${startsWith}${faker.datatype.number()}`;
      const discountValue = 50;
      const productPrice = 100;

      createSaleWithNewVariant({
        name: saleName,
        channel: defaultChannel,
        warehouseId: warehouse.id,
        productTypeId: productType.id,
        attributeId: attribute.id,
        categoryId: category.id,
        price: productPrice,
        discountOption: discountOptions.FIXED,
        discountValue
      }).then(({ pricing }) => {
        const priceInResponse = pricing.price.gross.amount;
        const expectedPrice = productPrice - discountValue;
        expect(expectedPrice).to.be.eq(priceInResponse);
      });
    });
  });
});
