/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { urlList } from "../../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../../fixtures/users";
import { createCheckout } from "../../../support/api/requests/Checkout";
import { createWarehouse } from "../../../support/api/requests/Warehouse";
import * as channelsUtils from "../../../support/api/utils/channelsUtils";
import * as productsUtils from "../../../support/api/utils/products/productsUtils";
import * as shippingUtils from "../../../support/api/utils/shippingUtils";
import { isShippingAvailableInCheckout } from "../../../support/api/utils/storeFront/checkoutUtils";
import filterTests from "../../../support/filterTests";
import {
  createShippingRate,
  createShippingZone,
  rateOptions
} from "../../../support/pages/shippingMethodPage";

filterTests({ definedTags: ["all"] }, () => {
  describe("Create shipping method", () => {
    const startsWith = "CreateShippingMethods-";
    const name = `${startsWith}${faker.datatype.number()}`;
    const price = 8;
    const deliveryTime = { min: 2, max: 5 };
    let defaultChannel;
    let plAddress;
    let variantsList;
    let warehouse;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      productsUtils.deleteProductsStartsWith(startsWith);
      shippingUtils.deleteShippingStartsWith(startsWith);

      channelsUtils
        .getDefaultChannel()
        .then(channel => {
          defaultChannel = channel;
          cy.fixture("addresses");
        })
        .then(addresses => {
          plAddress = addresses.plAddress;
          createWarehouse({ name, address: plAddress });
        })
        .then(warehouseResp => {
          warehouse = warehouseResp;
          productsUtils.createTypeAttributeAndCategoryForProduct({
            name: startsWith
          });
        })
        .then(
          ({
            productType: productTypeResp,
            category: categoryResp,
            attribute: attributeResp
          }) => {
            productsUtils.createProductInChannel({
              name,
              channelId: defaultChannel.id,
              productTypeId: productTypeResp.id,
              attributeId: attributeResp.id,
              categoryId: categoryResp.id,
              warehouseId: warehouse.id,
              quantityInWarehouse: 10
            });
          }
        )
        .then(({ variantsList: variantsListResp }) => {
          variantsList = variantsListResp;
        });
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
    });

    it("should create price based shipping method", () => {
      const shippingName = `${startsWith}${faker.datatype.number()}`;
      cy.clearSessionData().loginUserViaRequest(
        "auth",
        ONE_PERMISSION_USERS.shipping
      );
      cy.visit(urlList.shippingMethods).softExpectSkeletonIsVisible();
      createShippingZone(
        shippingName,
        warehouse.name,
        plAddress.countryFullName,
        defaultChannel.name
      );
      createShippingRate({
        rateName: shippingName,
        price,
        rateOption: rateOptions.PRICE_OPTION,
        deliveryTime
      });

      createCheckout({
        channelSlug: defaultChannel.slug,
        email: "test@example.com",
        variantsList,
        address: plAddress,
        auth: "token"
      }).then(({ checkout }) => {
        const isShippingAvailable = isShippingAvailableInCheckout(
          checkout,
          shippingName
        );
        expect(isShippingAvailable).to.be.true;
      });
    });

    it("should create weight based shipping method", () => {
      const shippingName = `${startsWith}${faker.datatype.number()}`;
      cy.clearSessionData().loginUserViaRequest(
        "auth",
        ONE_PERMISSION_USERS.shipping
      );
      cy.visit(urlList.shippingMethods).softExpectSkeletonIsVisible();
      createShippingZone(
        shippingName,
        warehouse.name,
        plAddress.countryFullName,
        defaultChannel.name
      );
      createShippingRate({
        rateName: shippingName,
        price,
        rateOption: rateOptions.WEIGHT_OPTION,
        deliveryTime
      });
      createCheckout({
        channelSlug: defaultChannel.slug,
        email: "test@example.com",
        variantsList,
        address: plAddress,
        auth: "token"
      }).then(({ checkout }) => {
        const isShippingAvailable = isShippingAvailableInCheckout(
          checkout,
          shippingName
        );
        expect(isShippingAvailable).to.be.true;
      });
    });
  });
});
