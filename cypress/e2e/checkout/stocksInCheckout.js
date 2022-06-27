/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import {
  addProductsToCheckout,
  createCheckout,
} from "../../support/api/requests/Checkout";
import { getVariants } from "../../support/api/requests/Product";
import { createWaitingForCaptureOrder } from "../../support/api/utils/ordersUtils";
import { createNewProductWithSeveralVariants } from "../../support/api/utils/products/productsUtils";

describe("Manage products stocks in checkout", () => {
  const startsWith = "CyStocksCheckout-";
  const name = `${startsWith}${faker.datatype.number()}`;

  let defaultChannel;
  let address;
  let shippingMethod;
  let variantsWithLowStock;
  let variantsWithoutTrackInventory;
  let lastVariantInStock;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();

    const variantsData = [
      {
        name: "variantsWithLowStock",
        trackInventory: true,
        quantityInWarehouse: 1,
      },
      {
        name: "variantsWithoutTrackInventory",
        trackInventory: false,
        quantityInWarehouse: 0,
      },
      {
        name: "lastVariantInStock",
        trackInventory: true,
        quantityInWarehouse: 1,
      },
    ];

    createNewProductWithSeveralVariants(name, variantsData).then(resp => {
      defaultChannel = resp.defaultChannel;
      address = resp.address;
      shippingMethod = resp.shippingMethod;
      variantsWithLowStock = resp.createdVariants.find(
        variant => variant.name === "variantsWithLowStock",
      );
      variantsWithoutTrackInventory = resp.createdVariants.find(
        variant => variant.name === "variantsWithoutTrackInventory",
      );
      lastVariantInStock = resp.createdVariants.find(
        variant => variant.name === "lastVariantInStock",
      );
    });
  });

  it(
    "should not be possible to add product with quantity greater than stock to checkout. TC: SALEOR_0405",
    { tags: ["@checkout", "@allEnv", "@stable"] },
    () => {
      createCheckout({
        channelSlug: defaultChannel.slug,
        address,
        billingAddress: address,
        email: "email@example.com",
        variantsList: [variantsWithLowStock],
        auth: "token",
      })
        .then(({ checkout: checkout }) => {
          addProductsToCheckout(checkout.id, [variantsWithLowStock], 2);
        })
        .then(({ errors }) => {
          expect(
            errors[0],
            "should return error on field quantity",
          ).to.have.property("field", "quantity");
        });
    },
  );

  it(
    "should buy product with no quantity if tracking is not set. TC: SALEOR_0406",
    { tags: ["@checkout", "@allEnv", "@stable"] },
    () => {
      createWaitingForCaptureOrder({
        address,
        channelSlug: defaultChannel.slug,
        email: "example@example.com",
        shippingMethodName: shippingMethod.name,
        variantsList: [variantsWithoutTrackInventory],
      }).then(({ order }) => {
        expect(order, "order should be created").to.be.ok;
      });
    },
  );

  it(
    "should create checkout with last product in stock. TC: SALEOR_0419",
    { tags: ["@checkout", "@allEnv", "@stable"] },
    () => {
      createWaitingForCaptureOrder({
        address,
        channelSlug: defaultChannel.slug,
        email: "example@example.com",
        shippingMethodName: shippingMethod.name,
        variantsList: [lastVariantInStock],
      })
        .then(({ order }) => {
          expect(order, "order should be created").to.be.ok;
          getVariants([lastVariantInStock]);
        })
        .then(variantsList => {
          const variant = variantsList.edges[0];
          expect(variant.node.stocks[0].quantityAllocated).to.eq(1);
          expect(variant.node.stocks[0].quantity).to.eq(1);
        });
    },
  );
});
