/// <reference types="cypress" />
import faker from "faker";

import {
  GIFT_CARD_LIST,
} from "../../../elements/catalog/giftCard/giftCardList";
import { urlList } from "../../../fixtures/urlList";
import { completeCheckout } from "../../../support/api/requests/Checkout";
import {
  createGiftCard,
  giftCardDeactivate,
} from "../../../support/api/requests/GiftCard";
import {
  createCheckoutWithDisabledGiftCard,
  isGiftCardDataAsExpected,
  purchaseProductWithActiveGiftCard,
} from "../../../support/api/utils/catalog/giftCardUtils";
import {
  addPayment,
  purchaseProductWithPromoCode,
} from "../../../support/api/utils/ordersUtils";
import * as productsUtils
  from "../../../support/api/utils/products/productsUtils";
import {
  updateTaxConfigurationForChannel,
} from "../../../support/api/utils/taxesUtils";
import { giftCardsPage } from "../../../support/pages";

describe("As a admin I want to use enabled gift card in checkout", () => {
  const startsWith = "ActivateGiftCards";
  const productPrice = 50;
  const shippingPrice = 50;
  const email = "example@example.com";
  const giftCardData = {
    amount: 150,
    currency: "USD",
  };

  let defaultChannel;
  let address;
  let dataForCheckout;

  before(() => {
    const name = `${startsWith}${faker.datatype.number()}`;

    cy.loginUserViaRequest();

    productsUtils
      .createProductWithShipping({ name, shippingPrice, productPrice })
      .then(resp => {
        defaultChannel = resp.defaultChannel;
        address = resp.address;

        dataForCheckout = {
          address,
          email,
          auth: "token",
          channelSlug: defaultChannel.slug,
          shippingMethodName: resp.shippingMethod.name,
          variantsList: resp.variantsList,
        };
        cy.checkIfDataAreNotNull(dataForCheckout);
      });
  });

  beforeEach(() => {
    cy.loginUserViaRequest();
    updateTaxConfigurationForChannel({
      channelSlug: defaultChannel.slug,
      pricesEnteredWithTax: true,
    });
  });

  it(
    "should be able to enable gift card and use it in checkout. TC: SALEOR_1006",
    { tags: ["@giftCard", "@allEnv", "@stable"] },
    () => {
      const expectedGiftCardBalance =
        giftCardData.amount - productPrice - shippingPrice;

      giftCardData.tag = `${startsWith}${faker.datatype.number()}`;
      let giftCard;

      createGiftCard(giftCardData)
        .then(giftCardResp => {
          giftCard = giftCardResp;
          giftCardDeactivate(giftCard.id);
        })
        .then(() => {
          giftCardsPage.changeGiftCardActiveStatus(giftCard.id);
          dataForCheckout.voucherCode = giftCard.code;
          purchaseProductWithPromoCode(dataForCheckout);
        })
        .then(({ order }) => {
          expect(order.total.gross.amount).to.eq(0);
          expect(order.userEmail).to.eq(email);
          isGiftCardDataAsExpected({
            giftCardId: giftCard.id,
            expectedAmount: expectedGiftCardBalance,
            userEmail: email,
            initialBalance: giftCardData.amount,
          });
        })
        .then(dataAsExpected => {
          expect(dataAsExpected).to.be.true;
        });
    },
  );

  it(
    "should not be able to disable gift card and use it in checkout. TC: SALEOR_1007",
    { tags: ["@giftCard", "@allEnv", "@stable"] },
    () => {
      giftCardData.tag = `${startsWith}${faker.datatype.number()}`;
      let giftCard;

      createGiftCard(giftCardData)
        .then(giftCardResp => {
          giftCard = giftCardResp;
          giftCardsPage.changeGiftCardActiveStatus(giftCard.id);
          dataForCheckout.voucherCode = giftCard.code;
          createCheckoutWithDisabledGiftCard(dataForCheckout);
        })
        .then(checkout => {
          addPayment(checkout.id);
          completeCheckout(checkout.id);
        })
        .then(() => {
          isGiftCardDataAsExpected({
            giftCardId: giftCard.id,
            expectedAmount: giftCardData.amount,
          });
        })
        .then(dataAsExpected => {
          expect(dataAsExpected).to.be.true;
        });
    },
  );

  it(
    "should not be able to disable several gift cards on gift card list page and use it in checkout. TC: SALEOR_1013",
    { tags: ["@giftCard", "@allEnv", "@stable"] },
    () => {
      const firstGiftCardTag = faker.datatype.number();
      const secondGiftCardTag = faker.datatype.number();
      const amount = 10;
      let firstGiftCard;
      let firstGiftCardCode;
      let secondGiftCard;
      let secondGiftCardCode;
      cy.addAliasToGraphRequest("GiftCardBulkDeactivate");
      createGiftCard({
        tag: firstGiftCardTag,
        amount,
        currency: "USD",
      })
        .then(giftCard => {
          firstGiftCard = giftCard;
          firstGiftCardCode = firstGiftCard.code;
          createGiftCard({
            tag: secondGiftCardTag,
            amount,
            currency: "USD",
          });
        })
        .then(giftCard => {
          secondGiftCard = giftCard;
          secondGiftCardCode = secondGiftCard.code;
          cy.visit(
            giftCardsPage.getUrlWithFilteredTags(urlList.giftCards, [
              firstGiftCardTag,
              secondGiftCardTag,
            ]),
          );

          giftCardsPage.selectGiftCardOnListView(secondGiftCardCode);
          giftCardsPage.selectGiftCardOnListView(firstGiftCardCode);
          giftCardsPage.clickDeactivateButton();
          cy.waitForRequestAndCheckIfNoErrors(
            "@GiftCardBulkDeactivate",
          ).confirmationMessageShouldAppear();
          dataForCheckout.voucherCode = firstGiftCard.code;
          createCheckoutWithDisabledGiftCard(dataForCheckout);
          dataForCheckout.voucherCode = secondGiftCard.code;
          createCheckoutWithDisabledGiftCard(dataForCheckout);
        })
        .then(checkout => {
          addPayment(checkout.id);
          completeCheckout(checkout.id);
        })
        .then(() => {
          isGiftCardDataAsExpected({
            giftCardId: firstGiftCard.id,
            expectedAmount: amount,
          }).then(dataAsExpected => expect(dataAsExpected).to.be.true);
          isGiftCardDataAsExpected({
            giftCardId: secondGiftCard.id,
            expectedAmount: amount,
          }).then(dataAsExpected => expect(dataAsExpected).to.be.true);
        });
    },
  );

  it(
    "should be able to enable several gift cards on gift card list page and use it in checkout. TC: SALEOR_1012",
    { tags: ["@giftCard", "@allEnv"] },
    () => {
      const amount = 10;
      const expectedOrderPrice = shippingPrice + productPrice - amount;
      const firstGiftCardTag = faker.datatype.number();
      const secondGiftCardTag = faker.datatype.number();
      let firstGiftCard;
      let firstGiftCardCode;
      let secondGiftCard;
      let secondGiftCardCode;
      cy.addAliasToGraphRequest("GiftCardBulkActivate");
      createGiftCard({
        tag: firstGiftCardTag,
        amount,
        currency: "USD",
        isActive: false,
      })
        .then(giftCard => {
          firstGiftCard = giftCard;
          firstGiftCardCode = giftCard.code;

          createGiftCard({
            tag: secondGiftCardTag,
            amount,
            currency: "USD",
            isActive: false,
          });
        })
        .then(giftCard => {
          secondGiftCard = giftCard;
          secondGiftCardCode = giftCard.code;
          cy.visit(
            giftCardsPage.getUrlWithFilteredTags(urlList.giftCards, [
              firstGiftCardTag,
              secondGiftCardTag,
            ]),
          );
          giftCardsPage.selectGiftCardOnListView(secondGiftCardCode);
          giftCardsPage.selectGiftCardOnListView(firstGiftCardCode);
          cy.get(GIFT_CARD_LIST.activateGiftCardButton)
            .click()
            .waitForRequestAndCheckIfNoErrors("@GiftCardBulkActivate")
            .confirmationMessageShouldAppear();
          dataForCheckout.voucherCode = firstGiftCard.code;
          purchaseProductWithActiveGiftCard({
            giftCard: firstGiftCard,
            expectedAmount: 0,
            initialAmount: amount,
            dataForCheckout,
            expectedOrderPrice,
          }).then(isDataAsExpected => expect(isDataAsExpected).to.be.true);
          dataForCheckout.voucherCode = secondGiftCard.code;
          purchaseProductWithActiveGiftCard({
            giftCard: secondGiftCard,
            expectedAmount: 0,
            initialAmount: amount,
            dataForCheckout,
            expectedOrderPrice,
          }).then(isDataAsExpected => expect(isDataAsExpected).to.be.true);
        });
    },
  );
});
