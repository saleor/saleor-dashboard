// <reference types="cypress" />
import faker from "faker";

import { GIFT_CARD_LIST } from "../../../elements/giftCard/giftCardList";
import { urlList } from "../../../fixtures/urlList";
import { completeCheckout } from "../../../support/api/requests/Checkout";
import {
  createGiftCard,
  giftCardDeactivate
} from "../../../support/api/requests/GiftCard";
import {
  deleteGiftCardsWithTagStartsWith,
  isGiftCardDataAsExpected
} from "../../../support/api/utils/catalog/giftCardUtils";
import * as channelsUtils from "../../../support/api/utils/channelsUtils";
import {
  addPayment,
  createCheckoutWithVoucher,
  purchaseProductWithPromoCode
} from "../../../support/api/utils/ordersUtils";
import * as productsUtils from "../../../support/api/utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../../support/api/utils/shippingUtils";
import filterTests from "../../../support/filterTests";
import {
  changeGiftCardActiveStatus,
  selectGiftCard
} from "../../../support/pages/catalog/giftCardPage";

filterTests({ definedTags: ["all"], version: "3.1.0" }, () => {
  describe("Gift cards in checkout", () => {
    const startsWith = "GiftCardsCheckout";
    const productPrice = 50;
    const shippingPrice = 50;
    const email = "example@example.com";

    let defaultChannel;
    let productType;
    let attribute;
    let category;
    let shippingMethod;
    let variants;
    let address;
    let dataForCheckout;
    const giftCardData = {
      amount: 150,
      currency: "USD"
    };

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      channelsUtils.deleteChannelsStartsWith(startsWith);
      productsUtils.deleteProductsStartsWith(startsWith);
      deleteShippingStartsWith(startsWith);
      deleteGiftCardsWithTagStartsWith(startsWith);

      const name = `${startsWith}${faker.datatype.number()}`;

      productsUtils
        .createTypeAttributeAndCategoryForProduct({ name })
        .then(
          ({
            productType: productTypeResp,
            attribute: attributeResp,
            category: categoryResp
          }) => {
            productType = productTypeResp;
            attribute = attributeResp;
            category = categoryResp;

            channelsUtils.getDefaultChannel();
          }
        )
        .then(channel => {
          defaultChannel = channel;
          cy.fixture("addresses");
        })
        .then(addresses => {
          address = addresses.plAddress;
          createShipping({
            channelId: defaultChannel.id,
            name,
            address,
            price: shippingPrice
          });
        })
        .then(
          ({ shippingMethod: shippingMethodResp, warehouse: warehouse }) => {
            shippingMethod = shippingMethodResp;
            productsUtils.createProductInChannel({
              name,
              channelId: defaultChannel.id,
              warehouseId: warehouse.id,
              productTypeId: productType.id,
              attributeId: attribute.id,
              categoryId: category.id,
              price: productPrice
            });
          }
        )
        .then(({ variantsList: variantsResp }) => {
          variants = variantsResp;

          dataForCheckout = {
            address,
            email,
            auth: "token",
            channelSlug: defaultChannel.slug,
            shippingMethodName: shippingMethod.name,
            variantsList: variants
          };
        });
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
    });

    it("As an admin I should be able to enable gift card and use it in checkout", () => {
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
          changeGiftCardActiveStatus(giftCard.id);
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
            initialBalance: giftCardData.amount
          });
        })
        .then(dataAsExpected => {
          expect(dataAsExpected).to.be.true;
        });
    });

    it("As an admin I should not be able to disable gift card and use it in checkout", () => {
      giftCardData.tag = `${startsWith}${faker.datatype.number()}`;
      let giftCard;

      createGiftCard(giftCardData)
        .then(giftCardResp => {
          giftCard = giftCardResp;
          changeGiftCardActiveStatus(giftCard.id);
          createCheckoutWithDisabledGiftCard(giftCard.code);
        })
        .then(checkout => {
          addPayment(checkout.id);
          completeCheckout(checkout.id);
        })
        .then(() => {
          isGiftCardDataAsExpected({
            giftCardId: giftCard.id,
            expectedAmount: giftCardData.amount
          });
        })
        .then(dataAsExpected => {
          expect(dataAsExpected).to.be.true;
        });
    });

    it("As an admin I should not be able to disable several gift cards on gift card list page and use it in checkout", () => {
      const firstGiftCardName = `${startsWith}${faker.datatype.number()}`;
      const secondGiftCardName = `${startsWith}${faker.datatype.number()}`;
      const amount = 10;
      let firstGiftCard;
      let secondGiftCard;

      createGiftCard({
        tag: firstGiftCardName,
        amount,
        currency: "USD"
      })
        .then(giftCard => {
          firstGiftCard = giftCard;
          createGiftCard({
            tag: secondGiftCardName,
            amount,
            currency: "USD"
          });
        })
        .then(giftCard => {
          secondGiftCard = giftCard;
          cy.visit(urlList.giftCards).waitForProgressBarToNotExist();
          selectGiftCard(firstGiftCard.id);
          selectGiftCard(secondGiftCard.id)
            .addAliasToGraphRequest("GiftCardBulkDeactivate")
            .get(GIFT_CARD_LIST.deactivateGiftCardButton)
            .click()
            .waitForRequestAndCheckIfNoErrors("@GiftCardBulkDeactivate")
            .confirmationMessageShouldDisappear();
          createCheckoutWithDisabledGiftCard(firstGiftCard.code);
          createCheckoutWithDisabledGiftCard(secondGiftCard.code);
        })
        .then(checkout => {
          addPayment(checkout.id);
          completeCheckout(checkout.id);
        })
        .then(() => {
          isGiftCardDataAsExpected({
            giftCardId: firstGiftCard.id,
            expectedAmount: amount
          }).then(dataAsExpected => expect(dataAsExpected).to.be.true);
          isGiftCardDataAsExpected({
            giftCardId: secondGiftCard.id,
            expectedAmount: amount
          }).then(dataAsExpected => expect(dataAsExpected).to.be.true);
        });
    });

    it("As an admin I should be able to enable several gift cards on gift card list page and use it in checkout", () => {
      const firstGiftCardName = `${startsWith}${faker.datatype.number()}`;
      const secondGiftCardName = `${startsWith}${faker.datatype.number()}`;
      const amount = 10;
      let firstGiftCard;
      let secondGiftCard;

      createGiftCard({
        tag: firstGiftCardName,
        amount,
        currency: "USD",
        isActive: false
      })
        .then(giftCard => {
          firstGiftCard = giftCard;
          createGiftCard({
            tag: secondGiftCardName,
            amount,
            currency: "USD",
            isActive: false
          });
        })
        .then(giftCard => {
          secondGiftCard = giftCard;
          cy.visit(urlList.giftCards).waitForProgressBarToNotExist();
          selectGiftCard(firstGiftCard.id);
          selectGiftCard(secondGiftCard.id)
            .addAliasToGraphRequest("GiftCardBulkActivate")
            .get(GIFT_CARD_LIST.activateGiftCardButton)
            .click()
            .waitForRequestAndCheckIfNoErrors("@GiftCardBulkActivate")
            .confirmationMessageShouldDisappear();
          purchaseProductWithActiveGiftCard({
            giftCard: firstGiftCard,
            expectedAmount: 0,
            initialAmount: amount
          }).then(isDataAsExpected => expect(isDataAsExpected).to.be.true);
          purchaseProductWithActiveGiftCard({
            giftCard: secondGiftCard,
            expectedAmount: 0,
            initialAmount: amount
          }).then(isDataAsExpected => expect(isDataAsExpected).to.be.true);
        });
    });

    function createCheckoutWithDisabledGiftCard(giftCardCode) {
      dataForCheckout.voucherCode = giftCardCode;
      return createCheckoutWithVoucher(dataForCheckout).then(
        ({ addPromoCodeResp, checkout }) => {
          expect(addPromoCodeResp.checkoutErrors[0].field).to.eq("promoCode");
          return checkout;
        }
      );
    }

    function purchaseProductWithActiveGiftCard({
      giftCard,
      expectedAmount,
      initialAmount
    }) {
      dataForCheckout.voucherCode = giftCard.code;
      return purchaseProductWithPromoCode(dataForCheckout).then(({ order }) => {
        expect(order.total.gross.amount).to.eq(
          shippingPrice + productPrice - initialAmount
        );
        expect(order.userEmail).to.eq(email);
        return isGiftCardDataAsExpected({
          giftCardId: giftCard.id,
          expectedAmount,
          userEmail: email,
          initialBalance: initialAmount
        });
      });
    }
  });
});
