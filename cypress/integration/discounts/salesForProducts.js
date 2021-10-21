/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { urlList } from "../../fixtures/urlList";
import { createChannel } from "../../support/api/requests/Channels";
import { updateChannelInProduct } from "../../support/api/requests/Product";
import * as channelsUtils from "../../support/api/utils/channelsUtils";
import { deleteSalesStartsWith } from "../../support/api/utils/discounts/salesUtils";
import * as productsUtils from "../../support/api/utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../support/api/utils/shippingUtils";
import { getProductPrice } from "../../support/api/utils/storeFront/storeFrontProductUtils";
import filterTests from "../../support/filterTests";
import {
  assignProducts,
  createSale,
  createSaleWithNewProduct,
  discountOptions
} from "../../support/pages/discounts/salesPage";

filterTests({ definedTags: ["all"] }, () => {
  describe("Sales discounts for products", () => {
    const startsWith = "CySales-";

    let productType;
    let attribute;
    let category;
    let defaultChannel;
    let warehouse;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      channelsUtils.deleteChannelsStartsWith(startsWith);
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

      createSaleWithNewProduct({
        name: saleName,
        channel: defaultChannel,
        warehouseId: warehouse.id,
        productTypeId: productType.id,
        attributeId: attribute.id,
        categoryId: category.id,
        price: productPrice,
        discountOption: discountOptions.PERCENTAGE,
        discountValue
      }).then(price => {
        const expectedPrice = (productPrice * discountValue) / 100;
        expect(expectedPrice).to.be.eq(price);
      });
    });

    it("should create fixed price discount", () => {
      const saleName = `${startsWith}${faker.datatype.number()}`;
      const discountValue = 50;
      const productPrice = 100;

      createSaleWithNewProduct({
        name: saleName,
        channel: defaultChannel,
        warehouseId: warehouse.id,
        productTypeId: productType.id,
        attributeId: attribute.id,
        categoryId: category.id,
        price: productPrice,
        discountOption: discountOptions.FIXED,
        discountValue
      }).then(price => {
        const expectedPrice = productPrice - discountValue;
        expect(expectedPrice).to.be.eq(price);
      });
    });

    it("should not displayed discount not assign to channel", () => {
      const saleName = `${startsWith}${faker.datatype.number()}`;
      let channel;
      let product;
      const discountValue = 50;
      const productPrice = 100;

      createChannel({ name: saleName }).then(
        channelResp => (channel = channelResp)
      );
      productsUtils
        .createProductInChannel({
          name: saleName,
          channelId: defaultChannel.id,
          warehouseId: warehouse.id,
          productTypeId: productType.id,
          attributeId: attribute.id,
          categoryId: category.id,
          price: productPrice
        })
        .then(({ product: productResp }) => {
          product = productResp;
          updateChannelInProduct({
            productId: product.id,
            channelId: channel.id
          });
        })
        .then(() => {
          /* Uncomment after fixing SALEOR-3367 bug
           cy.clearSessionData()
          .loginUserViaRequest("auth", ONE_PERMISSION_USERS.discount) 
          */

          cy.visit(urlList.sales);
          cy.softExpectSkeletonIsVisible();
          createSale({
            saleName,
            channelName: channel.name,
            discountValue
          });
          assignProducts(product.name);
          getProductPrice(product.id, defaultChannel.slug);
        })
        .then(price => expect(price).to.equal(productPrice));
    });
  });
});
