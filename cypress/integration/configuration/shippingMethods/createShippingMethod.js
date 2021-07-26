// <reference types="cypress" />
import faker from "faker";

import { createCheckout } from "../../../apiRequests/Checkout";
import { createWarehouse } from "../../../apiRequests/Warehouse";
import { ONE_PERMISSION_USERS } from "../../../Data/users";
import {
  createShippingRate,
  createShippingZone,
  rateOptions
} from "../../../steps/shippingMethodSteps";
import filterTests from "../../../support/filterTests";
import { urlList } from "../../../url/urlList";
import * as channelsUtils from "../../../utils/channelsUtils";
import * as productsUtils from "../../../utils/products/productsUtils";
import * as shippingUtils from "../../../utils/shippingUtils";
import { isShippingAvailableInCheckout } from "../../../utils/storeFront/checkoutUtils";

filterTests(["all"], () => {
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
          productsUtils.createTypeAttributeAndCategoryForProduct(startsWith);
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
