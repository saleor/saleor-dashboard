/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import {
  addShippingMethod,
  completeCheckout,
  createCheckout,
} from "../../../support/api/requests/Checkout";
import { getOrder } from "../../../support/api/requests/Order";
import { confirmThreeDSecure } from "../../../support/api/requests/stripe";
import { deleteCollectionsStartsWith } from "../../../support/api/utils/catalog/collectionsUtils";
import {
  addStripePaymentAndGetConfirmationData,
  getShippingMethodIdFromCheckout,
} from "../../../support/api/utils/ordersUtils";
import {
  createProductWithShipping,
  deleteProductsStartsWith,
} from "../../../support/api/utils/products/productsUtils";
import { deleteShippingStartsWith } from "../../../support/api/utils/shippingUtils";

describe("Stripe payments", () => {
  const startsWith = "Stripe-";
  const email = `example@example.com`;

  let address;
  let defaultChannel;
  let shippingMethod;
  let variantsList;
  let checkout;
  let paymentCards;
  let cardData;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteProductsStartsWith(startsWith);
    deleteShippingStartsWith(startsWith);
    deleteCollectionsStartsWith(startsWith);
    cy.fixture("cards").then(({ stripe }) => {
      paymentCards = stripe;
      cardData = {
        publicKey: paymentCards.publicApiKey,
        cvc: 123,
        expMonth: 10,
        expYear: 50,
      };
    });
    createProductWithShipping({ name: startsWith }).then(values => {
      address = values.address;
      defaultChannel = values.defaultChannel;
      shippingMethod = values.shippingMethod;
      variantsList = values.variantsList;
    });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
    createCheckout({
      channelSlug: defaultChannel.slug,
      email,
      variantsList,
      address,
      billingAddress: address,
      auth: "token",
    })
      .then(({ checkout: checkoutResp }) => {
        checkout = checkoutResp;
        const shippingMethodId = getShippingMethodIdFromCheckout(
          checkoutResp,
          shippingMethod.name,
        );
        addShippingMethod(checkout.id, shippingMethodId);
      })
      .then(({ checkout: checkoutResp }) => {
        checkout = checkoutResp;
      });
  });

  it(
    "should purchase products with simple card",
    { tags: ["@payments", "@stagedOnly"] },
    () => {
      const simpleCard = cardData;
      simpleCard.cardNumber = paymentCards.simpleCardNumber;
      addStripePaymentAndGetConfirmationData({
        card: simpleCard,
        checkoutId: checkout.id,
        amount: checkout.totalPrice.gross.amount,
      })
        .then(() => {
          completeCheckout(checkout.id);
        })
        .then(({ order }) => {
          getOrder(order.id);
        })
        .then(order => {
          expect(order.paymentStatus).to.eq("FULLY_CHARGED");
        });
    },
  );

  it(
    "should not purchase products with card with insufficient funds",
    { tags: ["@payments", "@stagedOnly"] },
    () => {
      const simpleCard = cardData;
      simpleCard.cardNumber = paymentCards.insufficientFundsCard;
      addStripePaymentAndGetConfirmationData({
        card: simpleCard,
        checkoutId: checkout.id,
        amount: checkout.totalPrice.gross.amount,
      }).then(resp => {
        expect(resp.body.error.code).to.equal("card_declined");
      });
    },
  );

  it(
    "should purchase products with 3D secure card",
    { tags: ["@payments", "@stagedOnly"] },
    () => {
      const threeDSecureCard = cardData;
      threeDSecureCard.cardNumber = paymentCards.threeDSecureAuthCard;
      addStripePaymentAndGetConfirmationData({
        card: threeDSecureCard,
        checkoutId: checkout.id,
        amount: checkout.totalPrice.gross.amount,
      })
        .then(resp => {
          confirmThreeDSecure(resp.body.next_action.redirect_to_url.url);
        })
        .then(() => {
          completeCheckout(checkout.id);
        })
        .then(({ order }) => {
          getOrder(order.id);
        })
        .then(order => {
          expect(order.paymentStatus).to.eq("FULLY_CHARGED");
        });
    },
  );

  it(
    "should not purchase product when 3D secure not pass",
    { tags: ["@payments", "@stagedOnly"] },
    () => {
      const threeDSecureCard = cardData;
      threeDSecureCard.cardNumber = paymentCards.threeDSecureAuthCard;
      addStripePaymentAndGetConfirmationData({
        card: threeDSecureCard,
        checkoutId: checkout.id,
        amount: checkout.totalPrice.gross.amount,
      })
        .then(resp => {
          confirmThreeDSecure(resp.body.next_action.redirect_to_url.url, false);
        })
        .then(() => {
          completeCheckout(checkout.id);
        })
        .then(({ order }) => {
          expect(order).to.not.be.ok;
        });
    },
  );
});
