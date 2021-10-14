/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { urlList } from "../../../fixtures/urlList";
import {
  addShippingMethod,
  completeCheckout,
  createCheckout
} from "../../../support/api/requests/Checkout";
import { getOrder } from "../../../support/api/requests/Order";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import { addStripePayment } from "../../../support/api/utils/ordersUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
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
      deleteProductsStartsWith(startsWith);
      deleteShippingStartsWith(startsWith);
      cy.fixture("cards").then(({ stripe }) => {
        paymentCards = stripe;
        cardData = {
          token: paymentCards.token,
          encryptedExpiryMonth: "10",
          encryptedExpiryYear: "24",
          encryptedSecurityCode: "123"
        };
      });
      cy.fixture("addresses")
        .then(addresses => {
          address = addresses.usAddress;
          getDefaultChannel();
        })
        .then(channelResp => {
          defaultChannel = channelResp;
          createShipping({
            channelId: channelResp.id,
            name,
            address,
            price: 10
          });
        })
        .then(
          ({
            warehouse: warehouseResp,
            shippingZone: shippingZoneResp,
            shippingMethod: shippingMethodResp
          }) => {
            warehouse = warehouseResp;
            shippingMethod = shippingMethodResp;
          }
        );
      createTypeAttributeAndCategoryForProduct({ name })
        .then(({ productType, attribute, category }) => {
          createProductInChannel({
            name,
            channelId: defaultChannel.id,
            warehouseId: warehouse.id,
            productTypeId: productType.id,
            attributeId: attribute.id,
            categoryId: category.id
          });
        })
        .then(({ variantsList: variants }) => (variantsList = variants));
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
          addStripePayment(checkout.id, checkoutResp.totalPrice.gross.amount);
        });
    });

    it("should purchase products with simple card", () => {
      const simpleCard = cardData;
      simpleCard.encryptedCardNumber = paymentCards.simpleCardNumber;
      cy.request({
        url: urlList.stripeApi,
        method: "POST",
        form: true,
        body: {
          type: "card",
          "card[number]": simpleCard.encryptedCardNumber,
          "card[cvc]": 212,
          "card[exp_month]": 10,
          "card[exp_year]": 24,
          pasted_fields: "number",
          key: simpleCard.publicApiKey
        },
        headers: {
          // TODO - remove secretKey and add in github to secrets
          Authorization: `Bearer `
        }
      })
        .then(resp => {
          addStripePayment(
            checkout.id,
            checkout.totalPrice.gross.amount,
            resp.body.id
          );
        })
        .then(() => {
          completeCheckout(checkout.id, simpleCard);
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
