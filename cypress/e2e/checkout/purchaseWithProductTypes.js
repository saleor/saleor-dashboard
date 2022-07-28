/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import {
  checkoutShippingAddressUpdate,
  checkoutVariantsUpdate,
  completeCheckout,
  createCheckout,
} from "../../support/api/requests/Checkout";
import { getOrder } from "../../support/api/requests/Order";
import {
  addPayment,
  createAndCompleteCheckoutWithoutShipping,
  createWaitingForCaptureOrder,
  getShippingMethodIdFromCheckout,
  updateShippingInCheckout,
} from "../../support/api/utils/ordersUtils";
import { createDigitalAndPhysicalProductWithNewDataAndDefaultChannel } from "../../support/api/utils/products/productsUtils";

describe("As an unlogged customer I want to order physical and digital products", () => {
  const startsWith = `CyPurchaseByType`;
  const email = `${startsWith}@example.com`;
  const testsMessage = "Check order status";
  const digitalName = `${startsWith}${faker.datatype.number()}`;
  const physicalName = `${startsWith}${faker.datatype.number()}`;

  let defaultChannel;
  let address;
  let shippingMethod;
  let digitalVariants;
  let physicalVariants;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    createDigitalAndPhysicalProductWithNewDataAndDefaultChannel({
      physicalProductName: physicalName,
      digitalProductName: digitalName,
    }).then(resp => {
      defaultChannel = resp.defaultChannel;
      address = resp.address;
      shippingMethod = resp.shippingMethod;
      digitalVariants = resp.digitalVariants;
      physicalVariants = resp.physicalVariants;
      cy.clearSessionData();
    });
  });

  it(
    "should purchase digital product as unlogged customer. TC: SALEOR_0402",
    { tags: ["@checkout", "@allEnv", "@stable"] },
    () => {
      createAndCompleteCheckoutWithoutShipping({
        channelSlug: defaultChannel.slug,
        email,
        billingAddress: address,
        variantsList: digitalVariants,
        auth: "token",
      })
        .then(({ order }) => {
          getOrder(order.id);
        })
        .then(order => {
          expect(
            order.isShippingRequired,
            "Check if is shipping required in order",
          ).to.eq(false);
          expect(order.status, testsMessage).to.be.eq("UNFULFILLED");
        });
    },
  );

  it(
    "should purchase physical product as unlogged customer. TC: SALEOR_0403",
    { tags: ["@checkout", "@allEnv", "@stable"] },
    () => {
      createWaitingForCaptureOrder({
        channelSlug: defaultChannel.slug,
        email,
        variantsList: physicalVariants,
        shippingMethodName: shippingMethod.name,
        address,
      })
        .then(({ order }) => {
          getOrder(order.id);
        })
        .then(order => {
          expect(
            order.isShippingRequired,
            "Check if is shipping required in order",
          ).to.eq(true);
          expect(order.status, testsMessage).to.be.eq("UNFULFILLED");
        });
    },
  );

  it(
    "should purchase multiple products with all product types as unlogged customer. TC: SALEOR_0404",
    { tags: ["@checkout", "@allEnv"] },
    () => {
      let checkout;

      createCheckout({
        channelSlug: defaultChannel.slug,
        email,
        variantsList: digitalVariants,
        billingAddress: address,
        auth: "token",
      })
        .then(({ checkout: checkoutResp }) => {
          checkout = checkoutResp;
          addPayment(checkout.id);
        })
        .then(() => {
          checkoutVariantsUpdate(checkout.id, physicalVariants);
        })
        .then(() => {
          const shippingMethodId = getShippingMethodIdFromCheckout(
            checkout,
            shippingMethod.name,
          );
          expect(
            shippingMethodId,
            "Should be not possible to add shipping method without shipping address",
          ).to.not.be.ok;
          checkoutShippingAddressUpdate(checkout.id, address);
        })
        .then(() => {
          addPayment(checkout.id);
        })
        .then(({ errors }) => {
          expect(
            errors,
            "Should be not possible to add payment without shipping",
          ).to.have.lengthOf(1);
          updateShippingInCheckout(checkout.token, shippingMethod.name);
        })
        .then(() => {
          addPayment(checkout.id);
        })
        .then(() => {
          completeCheckout(checkout.id);
        })
        .then(({ order }) => {
          getOrder(order.id);
        })
        .then(order => {
          expect(
            order.isShippingRequired,
            "Check if is shipping required in order",
          ).to.eq(true);
          expect(order.status, testsMessage).to.be.eq("UNFULFILLED");
        });
    },
  );
});
