// <reference types="cypress" />
import faker from "faker";

import { completeCheckout } from "../../support/api/requests/Checkout";
import {
  createGiftCard,
  getGiftCardWithId,
  getGiftCardWithTag,
  giftCardDeactivate
} from "../../support/api/requests/GiftCard";
import { deleteGiftCardsWithTagStartsWith } from "../../support/api/utils/catalog/giftCardUtils";
import * as channelsUtils from "../../support/api/utils/channelsUtils";
import {
  addPayment,
  createCheckoutWithVoucher,
  purchaseProductWithPromoCode
} from "../../support/api/utils/ordersUtils";
import * as productsUtils from "../../support/api/utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../support/api/utils/shippingUtils";
import filterTests from "../../support/filterTests";
import { changeGiftCardActiveStatus } from "../../support/pages/catalog/giftCardPage";

filterTests({ definedTags: ["all"], version: "3.1.0" }, () => {
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
        .createTypeAttributeAndCategoryForProduct({ name, kind: "GIFT_CARD" })
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
          purchaseProductWithPromoCode(dataForCheckout);
        })
        .then(({ order }) => {
          expect(order.total.gross.amount).to.eq(0);
          getGiftCardWithTag(giftCardData.tag);
        })
        .then(giftCardResp => {
          expect(giftCardResp.initialBalance.amount).to.eq(giftCardData.amount);
          expect(giftCardResp.currentBalance.amount).to.eq(
            giftCardData.amount - productPrice - shippingPrice
          );
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
        .then(({ addPromoCodeResp, checkout }) => {
          expect(addPromoCodeResp.checkoutErrors[0].field).to.eq("promoCode");
          addPayment(checkout.id);
          completeCheckout(checkout.id);
        })
        .then(() => {
          getGiftCardWithId(giftCard.id);
        })
        .then(giftCardResp => {
          expect(giftCardResp.currentBalance.amount).to.eq(giftCardData.amount);
        });
    });
  });
});
