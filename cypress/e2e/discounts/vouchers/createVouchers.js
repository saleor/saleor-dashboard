/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { urlList } from "../../../fixtures/urlList";
import { createChannel } from "../../../support/api/requests/Channels";
import { completeCheckout } from "../../../support/api/requests/Checkout";
import * as channelsUtils from "../../../support/api/utils/channelsUtils";
import { deleteVouchersStartsWith } from "../../../support/api/utils/discounts/vouchersUtils";
import {
  addPayment,
  createCheckoutWithVoucher,
} from "../../../support/api/utils/ordersUtils";
import * as productsUtils from "../../../support/api/utils/products/productsUtils";
import {
  createVoucher,
  discountOptions,
  loginAndCreateCheckoutForVoucherWithDiscount,
} from "../../../support/pages/discounts/vouchersPage";

describe("As an admin I want to create voucher", () => {
  const startsWith = "CyVou-";
  const productPrice = 100;
  const shippingPrice = 100;
  const voucherValue = 50;
  const name = `${startsWith}${faker.datatype.number()}`;

  let createdChannel;
  let dataForCheckout;
  let defaultChannel;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    channelsUtils.deleteChannelsStartsWith(startsWith);
    deleteVouchersStartsWith(startsWith);
    productsUtils
      .createProductWithShipping({ name, productPrice, shippingPrice })
      .then(
        ({
          variantsList: variantsResp,
          defaultChannel: channel,
          shippingMethod: shippingMethodResp,
          address: addressResp,
        }) => {
          defaultChannel = channel;

          dataForCheckout = {
            channelSlug: defaultChannel.slug,
            variantsList: variantsResp,
            address: addressResp,
            shippingMethodName: shippingMethodResp.name,
            auth: "token",
          };
        },
      );
  });

  it(
    "should be able to create fixed price voucher. TC: SALEOR_1901",
    { tags: ["@vouchers", "@allEnv", "@stable"] },
    () => {
      const voucherCode = `${startsWith}${faker.datatype.number()}`;
      const expectedAmount = productPrice + shippingPrice - voucherValue;
      let checkout;

      loginAndCreateCheckoutForVoucherWithDiscount({
        discount: discountOptions.FIXED,
        voucherValue,
        voucherCode,
        channelName: defaultChannel.name,
        dataForCheckout,
      }).then(({ addPromoCodeResp, checkout: checkoutResp }) => {
        expect(addPromoCodeResp.checkout.totalPrice.gross.amount).to.be.eq(
          expectedAmount,
        );
        dataForCheckout.voucherCode = voucherCode;
        checkout = checkoutResp;

        addPayment(checkout.id);
        completeCheckout(checkout.id)
          .its("order.total.gross.amount")
          .should("eq", expectedAmount);
      });
    },
  );

  it(
    "should be able to create percentage voucher. TC: SALEOR_1902",
    { tags: ["@vouchers", "@allEnv", "@stable"] },
    () => {
      const voucherCode = `${startsWith}${faker.datatype.number()}`;
      const expectedAmount =
        (productPrice * voucherValue) / 100 + shippingPrice;
      let checkout;

      loginAndCreateCheckoutForVoucherWithDiscount({
        discount: discountOptions.PERCENTAGE,
        voucherValue,
        voucherCode,
        channelName: defaultChannel.name,
        dataForCheckout,
      }).then(({ addPromoCodeResp, checkout: checkoutResp }) => {
        expect(addPromoCodeResp.checkout.totalPrice.gross.amount).to.be.eq(
          expectedAmount,
        );
        dataForCheckout.voucherCode = voucherCode;
        checkout = checkoutResp;

        addPayment(checkout.id);
        completeCheckout(checkout.id)
          .its("order.total.gross.amount")
          .should("eq", expectedAmount);
      });
    },
  );

  it(
    "should be able to create free shipping voucher. TC: SALEOR_1903",
    { tags: ["@vouchers", "@allEnv", "@stable"] },
    () => {
      const voucherCode = `${startsWith}${faker.datatype.number()}`;
      const expectedAmount = productPrice;
      let checkout;

      loginAndCreateCheckoutForVoucherWithDiscount({
        discount: discountOptions.SHIPPING,
        voucherCode,
        channelName: defaultChannel.name,
        dataForCheckout,
      }).then(({ addPromoCodeResp, checkout: checkoutResp }) => {
        expect(addPromoCodeResp.checkout.totalPrice.gross.amount).to.be.eq(
          expectedAmount,
        );
        dataForCheckout.voucherCode = voucherCode;
        checkout = checkoutResp;

        addPayment(checkout.id);
        completeCheckout(checkout.id)
          .its("order.total.gross.amount")
          .should("eq", productPrice);
      });
    },
  );

  it(
    "should be able to create voucher not available for selected channel. TC: SALEOR_1904",
    { tags: ["@vouchers", "@allEnv", "@stable"] },
    () => {
      const voucherCode = `${startsWith}${faker.datatype.number()}`;

      cy.clearSessionData()
        .loginUserViaRequest()
        .visit(urlList.vouchers);
      cy.expectSkeletonIsVisible();
      createChannel({ name }).then(channel => {
        createdChannel = channel;

        cy.reload();
        createVoucher({
          voucherCode,
          voucherValue,
          discountOption: discountOptions.PERCENTAGE,
          channelName: createdChannel.name,
        });
      });

      dataForCheckout.voucherCode = voucherCode;

      createCheckoutWithVoucher(dataForCheckout)
        .its("addPromoCodeResp.errors.0")
        .should("include", { field: "promoCode" })
        .and("include", { message: "Promo code is invalid" });
    },
  );
});
