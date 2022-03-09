/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { HOMEPAGE_SELECTORS } from "../../elements/homePage/homePage-selectors";
import { urlList } from "../../fixtures/urlList";
import {
  createCustomer,
  deleteCustomersStartsWith
} from "../../support/api/requests/Customer";
import { getDefaultChannel } from "../../support/api/utils/channelsUtils";
import * as homePageUtils from "../../support/api/utils/homePageUtils";
import {
  createReadyToFulfillOrder,
  createWaitingForCaptureOrder
} from "../../support/api/utils/ordersUtils";
import * as productsUtils from "../../support/api/utils/products/productsUtils";
import * as shippingUtils from "../../support/api/utils/shippingUtils";
import filterTests from "../../support/filterTests";
import {
  changeChannel,
  getOrdersReadyForCaptureRegex,
  getOrdersReadyToFulfillRegex,
  getProductsOutOfStockRegex,
  getSalesAmountRegex,
  getTodaysOrdersRegex
} from "../../support/pages/homePage";

filterTests({ definedTags: ["all", "critical", "refactored"] }, () => {
  describe("Homepage analytics", () => {
    const startsWith = "CyHomeAnalytics";
    const productPrice = 22;
    const shippingPrice = 12;
    const randomName = startsWith + faker.datatype.number();
    const randomEmail = `${startsWith}${randomName}@example.com`;

    let customerId;
    let defaultChannel;
    let createdVariants;
    let productType;
    let attribute;
    let category;
    let warehouse;
    let shippingMethod;
    let addresses;
    let ordersReadyToFulfillRegexp;
    let ordersReadyForCaptureRegexp;
    let productsOutOfStockRegexp;
    let salesAmountRegexp;
    let ordersRegexp;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      productsUtils.deleteProductsStartsWith(startsWith);
      deleteCustomersStartsWith(startsWith);
      shippingUtils.deleteShippingStartsWith(startsWith);

      getDefaultChannel()
        .then(channel => {
          defaultChannel = channel;
          cy.fixture("addresses");
        })
        .then(addressesFixture => (addresses = addressesFixture))
        .then(() =>
          createCustomer(randomEmail, randomName, addresses.plAddress)
        )
        .then(resp => {
          customerId = resp.user.id;
          shippingUtils.createShipping({
            channelId: defaultChannel.id,
            name: randomName,
            address: addresses.plAddress,
            price: shippingPrice
          });
        })
        .then(
          ({
            warehouse: warehouseResp,
            shippingMethod: shippingMethodResp
          }) => {
            warehouse = warehouseResp;
            shippingMethod = shippingMethodResp;
            productsUtils.createTypeAttributeAndCategoryForProduct({
              name: randomName
            });
          }
        )
        .then(
          ({
            productType: productTypeResp,
            attribute: attributeResp,
            category: categoryResp
          }) => {
            productType = productTypeResp;
            attribute = attributeResp;
            category = categoryResp;
            productsUtils.createProductInChannel({
              name: randomName,
              channelId: defaultChannel.id,
              warehouseId: warehouse.id,
              quantityInWarehouse: 20,
              productTypeId: productType.id,
              attributeId: attribute.id,
              categoryId: category.id,
              price: productPrice
            });
          }
        )
        .then(({ variantsList: variantsResp }) => {
          createdVariants = variantsResp;

          homePageUtils
            .getOrdersReadyToFulfill(defaultChannel.slug)
            .then(ordersReadyToFulfillBefore => {
              ordersReadyToFulfillRegexp = getOrdersReadyToFulfillRegex(
                ordersReadyToFulfillBefore,
                1
              );
            });
          homePageUtils
            .getOrdersReadyForCapture(defaultChannel.slug)
            .then(ordersReadyForCaptureBefore => {
              ordersReadyForCaptureRegexp = getOrdersReadyForCaptureRegex(
                ordersReadyForCaptureBefore,
                1
              );
            });
          homePageUtils
            .getProductsOutOfStock(defaultChannel.slug)
            .then(productsOutOfStockBefore => {
              productsOutOfStockRegexp = getProductsOutOfStockRegex(
                productsOutOfStockBefore,
                1
              );
            });
          homePageUtils
            .getSalesAmount(defaultChannel.slug)
            .then(salesAmount => {
              salesAmountRegexp = getSalesAmountRegex(
                salesAmount,
                productPrice * 2 + shippingPrice
              );
            });
          homePageUtils
            .getTodaysOrders(defaultChannel.slug)
            .then(ordersBefore => {
              ordersRegexp = getTodaysOrdersRegex(ordersBefore, 2);
            });
        })
        .then(() => {
          createReadyToFulfillOrder({
            customerId,
            shippingMethodId: shippingMethod.id,
            channelId: defaultChannel.id,
            variantsList: createdVariants,
            address: addresses.plAddress
          });
          createWaitingForCaptureOrder({
            channelSlug: defaultChannel.slug,
            email: randomEmail,
            variantsList: createdVariants,
            shippingMethodName: shippingMethod.name,
            address: addresses.plAddress
          });
          const productOutOfStockRandomName =
            startsWith + faker.datatype.number();

          productsUtils.createProductInChannel({
            name: productOutOfStockRandomName,
            channelId: defaultChannel.id,
            warehouseId: warehouse.id,
            quantityInWarehouse: 0,
            productTypeId: productType.id,
            attributeId: attribute.id,
            categoryId: category.id,
            price: productPrice
          });
        });
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
    });

    it("should correct amount of ready to fullfil orders be displayed", () => {
      cy.visit(urlList.homePage);
      changeChannel(defaultChannel.name);
      cy.contains(HOMEPAGE_SELECTORS.orders, ordersRegexp).should("be.visible");
      cy.contains(
        HOMEPAGE_SELECTORS.ordersReadyToFulfill,
        ordersReadyToFulfillRegexp
      ).should("be.visible");
      cy.contains(
        HOMEPAGE_SELECTORS.ordersReadyForCapture,
        ordersReadyForCaptureRegexp
      ).should("be.visible");
      cy.contains(HOMEPAGE_SELECTORS.sales, salesAmountRegexp).should(
        "be.visible"
      );
      cy.contains(
        HOMEPAGE_SELECTORS.productsOutOfStock,
        productsOutOfStockRegexp
      ).should("be.visible");
    });
  });
});
