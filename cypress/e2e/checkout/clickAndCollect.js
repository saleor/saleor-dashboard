/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import {
  WAREHOUSES_DETAILS,
} from "../../elements/warehouses/warehouse-details";
import {
  completeCheckout,
  createCheckout,
  deliveryMethodUpdate,
} from "../../support/api/requests/Checkout";
import { getOrder } from "../../support/api/requests/Order";
import { updateWarehouse } from "../../support/api/requests/Warehouse";
import { getDefaultChannel } from "../../support/api/utils/channelsUtils";
import { addPayment } from "../../support/api/utils/ordersUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
} from "../../support/api/utils/products/productsUtils";
import { createShipping } from "../../support/api/utils/shippingUtils";
import {
  createWarehouse,
  pickupOptions,
  visitAndEnablePickup,
  visitSetPublicStockAndEnablePickup,
} from "../../support/pages/warehousePage";

describe("Warehouses in checkout", () => {
  const startsWith = `clickAndCollect`;
  let defaultChannel;
  let usAddress;
  let secondUsAddress;
  let productData;
  let checkoutData;
  let variantsInOtherWarehouse;
  const productSku = `${faker.lorem.slug()}slug`;
  const productTypeSlug = `${faker.lorem.slug()}slug`;
  const productSlug = `${faker.lorem.slug()}slug`;
  const warehouseSlug = `${faker.lorem.slug()}slug`;

  before(() => {
    cy.loginUserViaRequest();
    cy.fixture("addresses")
      .then(addresses => {
        usAddress = addresses.usAddress;
        secondUsAddress = addresses.secondUsAddress;

        getDefaultChannel();
      })
      .then(channelResp => {
        defaultChannel = channelResp;
        createTypeAttributeAndCategoryForProduct({
          name: startsWith,
          slug: productTypeSlug,
        });
      })
      .then(({ attribute, productType, category }) => {
        productData = {
          attributeId: attribute.id,
          categoryId: category.id,
          channelId: defaultChannel.id,
          productTypeId: productType.id,
          quantityInWarehouse: 100,
        };
        checkoutData = {
          returnAvailableCollectionPoints: true,
          channelSlug: defaultChannel.slug,
          email: "example@example.com",
          address: secondUsAddress,
          billingAddress: usAddress,
        };
        createShipping({
          channelId: defaultChannel.id,
          name: startsWith,
          address: secondUsAddress,
          slug: warehouseSlug,
        });
      })
      .then(({ warehouse: warehouseResp }) => {
        productData.name = startsWith;
        productData.warehouseId = warehouseResp.id;

        updateWarehouse({ id: productData.warehouseId, isPrivate: false });
        createProductInChannel({
          ...productData,
          slug: productSlug,
          sku: productSku,
        });
      })
      .then(({ variantsList }) => {
        variantsInOtherWarehouse = variantsList;
        cy.checkIfDataAreNotNull({
          defaultChannel,
          usAddress,
          secondUsAddress,
          productData,
          checkoutData,
          variantsInOtherWarehouse,
        });
      });
  });

  beforeEach(() => {
    cy.loginUserViaRequest();
  });

  it(
    "should create warehouse with all warehouses pickup and private stock",
    { tags: ["@checkout", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const secondProductSlug = `${faker.lorem.slug()}slug`;

      let warehouse;

      createShipping({
        channelId: defaultChannel.id,
        name,
        address: secondUsAddress,
      })
        .then(({ warehouse: warehouseResp }) => {
          warehouse = warehouseResp;
          productData.name = name;
          productData.warehouseId = warehouse.id;

          visitAndEnablePickup(warehouse.id);
          createProductInChannel({ ...productData, slug: secondProductSlug });
        })
        .then(({ variantsList }) => {
          checkoutData.variantsList = variantsList.concat(
            variantsInOtherWarehouse,
          );
          createCheckout(checkoutData);
        })
        .then(({ checkout }) => {
          const clickAndCollectOption = checkout.availableCollectionPoints.find(
            element => element.id === warehouse.id,
          );
          expect(clickAndCollectOption.clickAndCollectOption).to.eq("ALL");
          expect(clickAndCollectOption.id).to.eq(warehouse.id);
          expect(clickAndCollectOption.isPrivate).to.eq(true);
          expect(clickAndCollectOption.name).to.eq(warehouse.name);
        });
    },
  );

  it(
    "should create warehouse with all warehouses pickup and public stock",
    { tags: ["@checkout", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let warehouse;

      createShipping({
        channelId: defaultChannel.id,
        name,
        address: secondUsAddress,
      })
        .then(({ warehouse: warehouseResp }) => {
          warehouse = warehouseResp;
          productData.name = name;
          productData.warehouseId = warehouse.id;

          visitSetPublicStockAndEnablePickup(warehouse.id);
          createProductInChannel(productData);
        })
        .then(({ variantsList }) => {
          checkoutData.variantsList = variantsList.concat(
            variantsInOtherWarehouse,
          );
          createCheckout(checkoutData);
        })
        .then(({ checkout }) => {
          const clickAndCollectOption = checkout.availableCollectionPoints.find(
            element => element.id === warehouse.id,
          );
          expect(clickAndCollectOption.clickAndCollectOption).to.eq("ALL");
          expect(clickAndCollectOption.id).to.eq(warehouse.id);
          expect(clickAndCollectOption.isPrivate).to.eq(false);
          expect(clickAndCollectOption.name).to.eq(warehouse.name);
        });
    },
  );

  it(
    "should create warehouse with local stock only pickup and public stock",
    { tags: ["@checkout", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let warehouse;
      let variantsInLocalStock;

      createShipping({
        channelId: defaultChannel.id,
        name,
        address: secondUsAddress,
      })
        .then(({ warehouse: warehouseResp }) => {
          warehouse = warehouseResp;
          productData.name = name;
          productData.warehouseId = warehouse.id;

          visitSetPublicStockAndEnablePickup(warehouse.id, pickupOptions.local);
          createProductInChannel(productData);
        })
        .then(({ variantsList }) => {
          variantsInLocalStock = variantsList;
          checkoutData.variantsList = variantsInLocalStock.concat(
            variantsInOtherWarehouse,
          );
          createCheckout(checkoutData);
        })
        .then(({ checkout }) => {
          expect(checkout.availableCollectionPoints).to.have.length(
            1,
            "there should be no available collection point for local stock",
          );

          checkoutData.variantsList = variantsInLocalStock;

          createCheckout(checkoutData)
            .its("checkout.availableCollectionPoints.0")
            .should("include", { id: warehouse.id })
            .and("include", { isPrivate: false })
            .and("include", { name: warehouse.name })
            .and("include", { clickAndCollectOption: "LOCAL" });
        });
    },
  );

  it(
    "should not be possible to set local pickup when private stock",
    { tags: ["@checkout", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;

      createWarehouse({ name, address: usAddress });
      cy.get(WAREHOUSES_DETAILS.clickAndCollectLocalStockRadioButton).should(
        "not.exist",
      );
    },
  );
  it(
    "should create order with warehouse address",
    { tags: ["@checkout", "@allEnv", "@stable"] },
    () => {
      checkoutData.variantsList = variantsInOtherWarehouse;

      createCheckout(checkoutData)
        .then(checkoutResp => {
          const clickAndCollectOption =
            checkoutResp.checkout.availableCollectionPoints[0];
          deliveryMethodUpdate(
            clickAndCollectOption.id,
            checkoutResp.checkout.token,
          );
          addPayment(checkoutResp.checkout.id);
          completeCheckout(checkoutResp.checkout.id);
        })
        .then(({ order }) => {
          getOrder(order.id);
        })
        .then(order => {
          cy.expectCorrectBasicAddress(order.shippingAddress, secondUsAddress);
          cy.expectCorrectBasicAddress(order.billingAddress, usAddress);
        });
    },
  );
});
