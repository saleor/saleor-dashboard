/// <reference types="cypress" />
import faker from "faker";

import { GIFT_CARD_LIST } from "../../../elements/catalog/giftCard/giftCardList";
import { urlList } from "../../../fixtures/urlList";
import { completeCheckout } from "../../../support/api/requests/Checkout";
import {
  createGiftCard,
  giftCardDeactivate
} from "../../../support/api/requests/GiftCard";
import {
  createCheckoutWithDisabledGiftCard,
  deleteGiftCardsWithTagStartsWith,
  isGiftCardDataAsExpected,
  purchaseProductWithActiveGiftCard
} from "../../../support/api/utils/catalog/giftCardUtils";
import * as channelsUtils from "../../../support/api/utils/channelsUtils";
import {
  addPayment,
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
  describe("As a admin I want to use enabled gift card in checkout", () => {
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

    it("should be able to enable gift card and use it in checkout. TC: SALEOR_1006", () => {
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

    it("should not be able to disable gift card and use it in checkout. TC: SALEOR_1007", () => {
      giftCardData.tag = `${startsWith}${faker.datatype.number()}`;
      let giftCard;

      createGiftCard(giftCardData)
        .then(giftCardResp => {
          giftCard = giftCardResp;
          changeGiftCardActiveStatus(giftCard.id);
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
            expectedAmount: giftCardData.amount
          });
        })
        .then(dataAsExpected => {
          expect(dataAsExpected).to.be.true;
        });
    });

    it("should not be able to disable several gift cards on gift card list page and use it in checkout. TC: SALEOR_1013", () => {
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
            expectedAmount: amount
          }).then(dataAsExpected => expect(dataAsExpected).to.be.true);
          isGiftCardDataAsExpected({
            giftCardId: secondGiftCard.id,
            expectedAmount: amount
          }).then(dataAsExpected => expect(dataAsExpected).to.be.true);
        });
    });

    it("should be able to enable several gift cards on gift card list page and use it in checkout. TC: SALEOR_1012", () => {
      const firstGiftCardName = `${startsWith}${faker.datatype.number()}`;
      const secondGiftCardName = `${startsWith}${faker.datatype.number()}`;
      const amount = 10;
      const expectedOrderPrice = shippingPrice + productPrice - amount;
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
          dataForCheckout.voucherCode = firstGiftCard.code;
          purchaseProductWithActiveGiftCard({
            giftCard: firstGiftCard,
            expectedAmount: 0,
            initialAmount: amount,
            dataForCheckout,
            expectedOrderPrice
          }).then(isDataAsExpected => expect(isDataAsExpected).to.be.true);
          dataForCheckout.voucherCode = secondGiftCard.code;
          purchaseProductWithActiveGiftCard({
            giftCard: secondGiftCard,
            expectedAmount: 0,
            initialAmount: amount,
            dataForCheckout,
            expectedOrderPrice
          }).then(isDataAsExpected => expect(isDataAsExpected).to.be.true);
        });
    });
  });
});
