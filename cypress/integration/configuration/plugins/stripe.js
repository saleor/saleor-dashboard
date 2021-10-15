/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { stripeConfirmationUrl, urlList } from "../../../fixtures/urlList";
import {
  addShippingMethod,
  completeCheckout,
  createCheckout
} from "../../../support/api/requests/Checkout";
import { getOrder } from "../../../support/api/requests/Order";
import {
  getPaymentMethodStripeId,
  sendConfirmationToStripe
} from "../../../support/api/requests/stripe";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import { addStripePayment } from "../../../support/api/utils/ordersUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
  deleteProductsAndCreateNewOneWithNewDataAndDefaultChannel,
  deleteProductsStartsWith
} from "../../../support/api/utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../../support/api/utils/shippingUtils";
import filterTests from "../../../support/filterTests";

filterTests({ definedTags: ["stagedOnly"] }, () => {
  describe("Stripe payments", () => {
    const startsWith = "Stripe-";
    const name = startsWith + faker.datatype.number();
    const email = `example@example.com`;
    // TODO - remove secretKey and add in github to secrets
    const stripeAuthBearer = `Bearer sk_test_u2tDALpvCQxFVEMKyIcGwjEP00DqpiRdiq`;

    let address;
    let defaultChannel;
    let warehouse;
    let shippingMethod;
    let variantsList;
    let checkout;
    let paymentCards;
    let cardData;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteShippingStartsWith(startsWith);
      cy.fixture("cards").then(({ stripe }) => {
        paymentCards = stripe;
        cardData = {
          publicKey: paymentCards.publicApiKey,
          encryptedExpiryMonth: "10",
          encryptedExpiryYear: "24",
          encryptedSecurityCode: "123"
        };
      });
      // cy.fixture("addresses")
      //   .then(addresses => {
      //     address = addresses.usAddress;
      //     getDefaultChannel();
      //   })
      //   .then(channelResp => {
      //     defaultChannel = channelResp;
      //     createShipping({
      //       channelId: channelResp.id,
      //       name,
      //       address,
      //       price: 10
      //     });
      //   })
      //   .then(
      //     ({
      //       warehouse: warehouseResp,
      //       shippingZone: shippingZoneResp,
      //       shippingMethod: shippingMethodResp
      //     }) => {
      //       warehouse = warehouseResp;
      //       shippingMethod = shippingMethodResp;
      //     }
      //   );
      // deleteProductsAndCreateNewOneWithNewDataAndDefaultChannel(startsWith)
      //   .then(({ variantsList: variants }) => {
      //     variantsList = variants
      //   })
      // createTypeAttributeAndCategoryForProduct({ name })
      //   .then(({ productType, attribute, category }) => {
      //     createProductInChannel({
      //       name,
      //       channelId: defaultChannel.id,
      //       warehouseId: warehouse.id,
      //       productTypeId: productType.id,
      //       attributeId: attribute.id,
      //       categoryId: category.id
      //     });
      //   })
      //   .then(({ variantsList: variants }) => (variantsList = variants));
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
      createCheckout({
        channelSlug: defaultChannel.slug,
        email,
        variantsList,
        address,
        billingAddress: address,
        auth: "token"
      })
        .then(({ checkout: checkoutResp }) => {
          checkout = checkoutResp;
          addShippingMethod(checkout.id, shippingMethod.id);
        })
        .then(({ checkout: checkoutResp }) => {
          checkout = checkoutResp;
        });
    });

    it("should purchase products with simple card", () => {
      const simpleCard = cardData;
      let paymentMethodId;
      simpleCard.encryptedCardNumber = paymentCards.simpleCardNumber;
      getPaymentMethodStripeId({
        cardNumber: simpleCard.encryptedCardNumber,
        cvc: 123,
        expMonth: 10,
        expYear: 50
      })
        .then(resp => {
          paymentMethodId = resp.body.id;
          addStripePayment(
            checkout.id,
            checkout.totalPrice.gross.amount,
            resp.body.id
          );
        })
        .then(() => {
          completeCheckout(checkout.id);
        })
        .then(resp => {
          const confirmationData = JSON.parse(resp.confirmationData);
          sendConfirmationToStripe(paymentMethodId, confirmationData.id);
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
    });
  });
});
