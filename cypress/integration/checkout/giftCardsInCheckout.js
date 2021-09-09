// <reference types="cypress" />
import faker from "faker";

import {
  createGiftCard,
  getGiftCardWithTag,
  giftCardDeactivate,
  giftCardExpiryOptions
} from "../../apiRequests/giftCards";
import { GIFT_CARD_UPDATE } from "../../elements/giftCard/gitfCardUpdate";
import { changeGiftCardActiveStatus } from "../../steps/giftCardSteps";
import { confirmationMessageShouldDisappear } from "../../steps/shared/confirmationMessages";
import filterTests from "../../support/filterTests";
import { giftCardDetailsUrl } from "../../url/urlList";
import * as channelsUtils from "../../utils/channelsUtils";
import { deleteGiftCardsWithTagStartsWith } from "../../utils/giftCardUtils";
import {
  createCheckoutWithVoucher,
  purchaseProductWithPromoCode
} from "../../utils/ordersUtils";
import * as productsUtils from "../../utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../utils/shippingUtils";

filterTests(["all"], () => {
  describe("Gift cards in checkout", () => {
    const startsWith = "GiftCardsCheckout";
    const productPrice = 50;
    const shippingPrice = 50;

    let defaultChannel;
    let productType;
    let attribute;
    let category;
    let shippingMethod;
    let variants;
    let address;
    let dataForCheckout;
    const giftCardData = {
      expiryType: giftCardExpiryOptions.NEVER_EXPIRE,
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
        .createTypeAttributeAndCategoryForProduct(name)
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
            auth: "token",
            channelSlug: defaultChannel.slug,
            shippingMethodId: shippingMethod.id,
            variantsList: variants
          };
        });
    });

    it("should buy product with gift card", () => {
      giftCardData.tag = `${startsWith}${faker.datatype.number()}`;

      createGiftCard(giftCardData)
        .then(giftCard => {
          dataForCheckout.voucherCode = giftCard.code;
          purchaseProductWithPromoCode(dataForCheckout);
        })
        .then(({ checkout }) => {
          expect(checkout.totalPrice.gross.amount).to.eq(0);
          getGiftCardWithTag(giftCardData.tag);
        })
        .then(giftCard => {
          expect(giftCard.initialBalance.amount).to.eq(giftCardData.amount);
          expect(giftCard.currentBalance.amount).to.eq(
            giftCardData.amount - productPrice - shippingPrice
          );
        });
    });

    it("should enable gift card", () => {
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
          createCheckoutWithVoucher(dataForCheckout);
        })
        .then(({ checkout }) => {
          expect(checkout.totalPrice.gross.amount).to.eq(0);
        });
    });

    it("should disable giftCard", () => {
      giftCardData.tag = `${startsWith}${faker.datatype.number()}`;
      let giftCard;

      createGiftCard(giftCardData)
        .then(giftCardResp => {
          giftCard = giftCardResp;
          changeGiftCardActiveStatus(giftCard.id);
          dataForCheckout.voucherCode = giftCard.code;
          createCheckoutWithVoucher(dataForCheckout);
        })
        .then(({ checkoutErrors }) => {
          expect(checkoutErrors[0].field).to.eq("promoCode");
        });
    });
  });
});
