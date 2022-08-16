/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import {
  addShippingMethod,
  completeCheckout,
  createCheckout,
} from "../../../support/api/requests/Checkout";
import { getOrder } from "../../../support/api/requests/Order";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import {
  addAdyenPayment,
  getShippingMethodIdFromCheckout,
} from "../../../support/api/utils/ordersUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith,
} from "../../../support/api/utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith,
} from "../../../support/api/utils/shippingUtils";

describe("Adyen payments", () => {
  const startsWith = "Adyen";
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
    cy.fixture("cards").then(cardsResp => {
      paymentCards = cardsResp.adyen;
      cardData = {
        clientData: paymentCards.clientData,
        encryptedExpiryMonth: paymentCards.encryptedExpiryMonth,
        encryptedExpiryYear: paymentCards.encryptedExpiryYear,
        encryptedSecurityCode: paymentCards.encryptedSecurityCodes.matches,
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
          price: 10,
        });
      })
      .then(
        ({
          warehouse: warehouseResp,
          shippingZone: shippingZoneResp,
          shippingMethod: shippingMethodResp,
        }) => {
          warehouse = warehouseResp;
          shippingMethod = shippingMethodResp;
        },
      );
    createTypeAttributeAndCategoryForProduct({ name })
      .then(({ productType, attribute, category }) => {
        createProductInChannel({
          name,
          channelId: defaultChannel.id,
          warehouseId: warehouse.id,
          productTypeId: productType.id,
          attributeId: attribute.id,
          categoryId: category.id,
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
      auth: "token",
    })
      .then(({ checkout: checkoutResp }) => {
        const shippingMethodId = getShippingMethodIdFromCheckout(
          checkoutResp,
          shippingMethod.name,
        );
        checkout = checkoutResp;
        addShippingMethod(checkout.id, shippingMethodId);
      })
      .then(({ checkout: checkoutResp }) => {
        addAdyenPayment(checkout.id, checkoutResp.totalPrice.gross.amount);
      });
  });

  it(
    "should purchase products with simple card",
    { tags: ["@payments", "@stagedOnly"] },
    () => {
      const simpleCard = cardData;
      simpleCard.encryptedCardNumber =
        paymentCards.cards.simpleCard.encryptedCardNumber;
      simpleCard.brand = paymentCards.cards.simpleCard.brand;
      completeCheckout(checkout.id, simpleCard)
        .then(({ order }) => {
          getOrder(order.id);
        })
        .then(order => {
          expect(order.paymentStatus).to.eq("FULLY_CHARGED");
        });
    },
  );

  it(
    "should purchase product with 3D secure 2 Auth",
    { tags: ["@payments", "@stagedOnly"] },
    () => {
      const threeDSecureCard = cardData;
      threeDSecureCard.encryptedCardNumber =
        paymentCards.cards.threeDSecureTwoAuth.encryptedCardNumber;
      threeDSecureCard.brand = paymentCards.cards.threeDSecureTwoAuth.brand;
      completeCheckout(checkout.id, threeDSecureCard)
        .then(({ order }) => {
          getOrder(order.id);
        })
        .then(order => {
          expect(order.paymentStatus).to.eq("FULLY_CHARGED");
        });
    },
  );

  it(
    "should purchase product with 3D secure 1 Auth",
    { tags: ["@payments", "@stagedOnly"] },
    () => {
      const threeDSecureCardOneAuth = cardData;
      threeDSecureCardOneAuth.encryptedCardNumber =
        paymentCards.cards.threeDSecureOneAuth.encryptedCardNumber;
      threeDSecureCardOneAuth.brand =
        paymentCards.cards.threeDSecureOneAuth.brand;
      completeCheckout(checkout.id, threeDSecureCardOneAuth)
        .then(({ order }) => {
          getOrder(order.id);
        })
        .then(order => {
          expect(order.paymentStatus).to.eq("FULLY_CHARGED");
        });
    },
  );

  it(
    "should fail with unknown security number",
    { tags: ["@payments", "@stagedOnly"] },
    () => {
      const simpleCard = cardData;
      simpleCard.encryptedCardNumber =
        paymentCards.cards.simpleCard.encryptedCardNumber;
      simpleCard.brand = paymentCards.cards.simpleCard.brand;
      simpleCard.encryptedSecurityCode =
        paymentCards.encryptedSecurityCodes.unknown;
      completeCheckout(checkout.id, simpleCard).then(({ errors }) => {
        expect(errors).to.have.length(1);
      });
    },
  );

  it(
    "should fail with timeout in 3D authorization",
    { tags: ["@payments", "@stagedOnly"] },
    () => {
      const errorCard = cardData;
      errorCard.encryptedCardNumber =
        paymentCards.cards.errorCard.encryptedCardNumber;
      errorCard.brand = paymentCards.cards.errorCard.brand;
      completeCheckout(checkout.id, errorCard).then(({ errors }) => {
        expect(errors).to.have.length(1);
      });
    },
  );

  it(
    "should fail with closed account",
    { tags: ["@payments", "@stagedOnly"] },
    () => {
      const closeAccount = cardData;
      closeAccount.encryptedCardNumber =
        paymentCards.cards.closeAccount.encryptedCardNumber;
      closeAccount.brand = paymentCards.cards.closeAccount.brand;
      completeCheckout(checkout.id, closeAccount).then(({ errors }) => {
        expect(errors).to.have.length(1);
      });
    },
  );
});
