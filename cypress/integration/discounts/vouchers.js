/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { urlList, voucherDetailsUrl } from "../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../fixtures/users";
import { createChannel } from "../../support/api/requests/Channels";
import { completeCheckout } from "../../support/api/requests/Checkout";
import * as channelsUtils from "../../support/api/utils/channelsUtils";
import {
  createVoucherInChannel,
  deleteVouchersStartsWith
} from "../../support/api/utils/discounts/vouchersUtils";
import {
  addPayment,
  createCheckoutWithVoucher
} from "../../support/api/utils/ordersUtils";
import * as productsUtils from "../../support/api/utils/products/productsUtils";
import { deleteShippingStartsWith } from "../../support/api/utils/shippingUtils";
import filterTests from "../../support/filterTests";
import {
  createVoucher,
  discountOptions
} from "../../support/pages/discounts/vouchersPage";

filterTests({ definedTags: ["all"] }, () => {
  describe("Vouchers discounts", () => {
    const startsWith = "CyVou-";
    const productPrice = 100;
    const shippingPrice = 100;

    let defaultChannel;
    let createdChannel;
    let shippingMethod;
    let variants;
    let product;
    let address;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      channelsUtils.deleteChannelsStartsWith(startsWith);
      deleteVouchersStartsWith(startsWith);
      deleteShippingStartsWith(startsWith);
      const name = `${startsWith}${faker.datatype.number()}`;
      productsUtils
        .createProductWithShipping({ name, productPrice, shippingPrice })
        .then(
          ({
            variantsList: variantsResp,
            defaultChannel: channel,
            shippingMethod: shippingMethodResp,
            address: addressResp,
            product: productResp
          }) => {
            variants = variantsResp;
            defaultChannel = channel;
            shippingMethod = shippingMethodResp;
            address = addressResp;
            product = productResp;
            createChannel({ name });
          }
        )
        .then(channel => {
          createdChannel = channel;
        });
    });

    it("should create percentage voucher", () => {
      const voucherValue = 50;
      const voucherCode = `${startsWith}${faker.datatype.number()}`;
      const expectedAmount =
        (productPrice * voucherValue) / 100 + shippingPrice;
      let checkout;

      loginAndCreateCheckoutForVoucherWithDiscount(
        discountOptions.PERCENTAGE,
        voucherValue,
        voucherCode
      )
        .then(amount => {
          expect(amount).to.be.eq(expectedAmount);
          createCheckoutForCreatedVoucher(voucherCode);
        })
        .then(resp => {
          expect(resp.addPromoCodeResp.checkout.totalPrice.gross.amount).to.eq(
            expectedAmount
          );
          checkout = resp.checkout;
          addPayment(checkout.id);
        })
        .then(() => {
          completeCheckout(checkout.id);
        })
        .then(({ order }) => {
          expect(order.id).to.be.ok;
        });
    });

    it("should create fixed price voucher", () => {
      const voucherValue = 50;
      const voucherCode = `${startsWith}${faker.datatype.number()}`;
      const expectedAmount = productPrice + shippingPrice - voucherValue;
      let checkout;

      loginAndCreateCheckoutForVoucherWithDiscount(
        discountOptions.FIXED,
        voucherValue,
        voucherCode
      )
        .then(amount => {
          expect(amount).to.be.eq(expectedAmount);
          createCheckoutForCreatedVoucher(voucherCode);
        })
        .then(resp => {
          expect(resp.addPromoCodeResp.checkout.totalPrice.gross.amount).to.eq(
            expectedAmount
          );
          checkout = resp.checkout;
          addPayment(checkout.id);
        })
        .then(() => {
          completeCheckout(checkout.id);
        })
        .then(({ order }) => {
          expect(order.id).to.be.ok;
        });
    });

    it("should create free shipping voucher", () => {
      const voucherCode = `${startsWith}${faker.datatype.number()}`;
      const expectedAmount = productPrice;
      let checkout;

      loginAndCreateCheckoutForVoucherWithDiscount(
        discountOptions.SHIPPING,
        null,
        voucherCode
      )
        .then(amount => {
          expect(amount).to.be.eq(expectedAmount);
          createCheckoutForCreatedVoucher(voucherCode);
        })
        .then(resp => {
          expect(resp.addPromoCodeResp.checkout.totalPrice.gross.amount).to.eq(
            expectedAmount
          );
          checkout = resp.checkout;
          addPayment(checkout.id);
        })
        .then(() => {
          completeCheckout(checkout.id);
        })
        .then(({ order }) => {
          expect(order.id).to.be.ok;
        });
    });

    it("should create voucher not available for selected channel", () => {
      const randomName = `${startsWith}${faker.datatype.number()}`;
      const voucherValue = 50;

      cy.clearSessionData()
        .loginUserViaRequest()
        .visit(urlList.vouchers);
      cy.softExpectSkeletonIsVisible();
      createVoucher({
        voucherCode: randomName,
        voucherValue,
        discountOption: discountOptions.PERCENTAGE,
        channelName: createdChannel.name
      });
      createCheckoutForCreatedVoucher(randomName).then(
        ({ addPromoCodeResp }) => {
          const errorField = addPromoCodeResp.checkoutErrors[0].field;
          expect(errorField).to.be.eq("promoCode");
        }
      );
    });

    it("should delete voucher", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const voucherValue = 50;

      let voucher;

      cy.clearSessionData().loginUserViaRequest();
      createVoucherInChannel({
        name,
        productId: product.id,
        channelId: defaultChannel.id,
        value: voucherValue
      })
        .then(voucherResp => {
          voucher = voucherResp;
          expect(voucher.id).to.be.ok;
          cy.visit(voucherDetailsUrl(voucher.id))
            .addAliasToGraphRequest("VoucherDelete")
            .get(BUTTON_SELECTORS.deleteButton)
            .click()
            .get(BUTTON_SELECTORS.submit)
            .click()
            .wait("@VoucherDelete");
          createCheckoutForCreatedVoucher(voucher.code);
        })
        .then(({ addPromoCodeResp }) => {
          const errorField = addPromoCodeResp.checkoutErrors[0].field;
          expect(errorField).to.be.eq("promoCode");
        });
    });

    function createCheckoutForCreatedVoucher(voucherCode) {
      return createCheckoutWithVoucher({
        channelSlug: defaultChannel.slug,
        variantsList: variants,
        address,
        shippingMethodName: shippingMethod.name,
        voucherCode,
        auth: "token"
      });
    }

    function loginAndCreateCheckoutForVoucherWithDiscount(
      discount,
      voucherValue,
      voucherCode
    ) {
      cy.clearSessionData()
        .loginUserViaRequest("auth", ONE_PERMISSION_USERS.discount)
        .visit(urlList.vouchers);
      cy.softExpectSkeletonIsVisible();
      createVoucher({
        voucherCode,
        voucherValue,
        discountOption: discount,
        channelName: defaultChannel.name
      });
      return createCheckoutForCreatedVoucher(voucherCode).its(
        "addPromoCodeResp.checkout.totalPrice.gross.amount"
      );
    }
  });
});
