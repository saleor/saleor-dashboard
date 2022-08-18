/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { completeCheckout } from "../../../support/api/requests/Checkout";
import * as channelsUtils from "../../../support/api/utils/channelsUtils";
import { deleteVouchersStartsWith } from "../../../support/api/utils/discounts/vouchersUtils";
import {
  addPayment,
  createCheckoutWithVoucher,
} from "../../../support/api/utils/ordersUtils";
import * as productsUtils from "../../../support/api/utils/products/productsUtils";
import {
  discountOptions,
  loginAndCreateCheckoutForVoucherWithDiscount,
} from "../../../support/pages/discounts/vouchersPage";

describe("As an admin I want to create voucher", () => {
  const startsWith = "CyVouLimit-";
  const productPrice = 100;
  const shippingPrice = 100;
  const voucherValue = 50;

  let defaultChannel;
  let dataForCheckout;

  before(() => {
    const name = `${startsWith}${faker.datatype.number()}`;

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
          cy.clearSessionData();
        },
      );
  });

  it(
    "should be able to create voucher with limited number of times discount can be used in total. TC: SALEOR_1907",
    { tags: ["@vouchers", "@allEnv", "@stable"] },
    () => {
      const voucherCode = `${startsWith}${faker.datatype.number()}`;
      const usageLimit = 1;
      dataForCheckout.auth = "auth";
      let firstCheckout;

      loginAndCreateCheckoutForVoucherWithDiscount({
        discount: discountOptions.PERCENTAGE,
        voucherValue,
        voucherCode,
        channelName: defaultChannel.name,
        dataForCheckout,
        usageLimit,
      }).then(({ checkout, addPromoCodeResp }) => {
        expect(addPromoCodeResp.errors).to.be.empty;
        firstCheckout = checkout;
        dataForCheckout.voucherCode = voucherCode;

        addPayment(firstCheckout.id);
        completeCheckout(firstCheckout.id);
        createCheckoutWithVoucher(dataForCheckout)
          .its("addPromoCodeResp.errors.0")
          .should("include", { field: "promoCode" })
          .and("include", { message: "Promo code is invalid" });
      });
    },
  );

  it(
    "should be able to create voucher with limit to one use per customer. TC: SALEOR_1908",
    { tags: ["@vouchers", "@allEnv", "@stable"] },
    () => {
      const voucherCode = `${startsWith}${faker.datatype.number()}`;
      dataForCheckout.auth = "auth";
      let firstCheckout;

      loginAndCreateCheckoutForVoucherWithDiscount({
        discount: discountOptions.PERCENTAGE,
        voucherValue,
        voucherCode,
        channelName: defaultChannel.name,
        dataForCheckout,
        applyOnePerCustomer: true,
      }).then(({ checkout, addPromoCodeResp }) => {
        expect(addPromoCodeResp.errors).to.be.empty;
        firstCheckout = checkout;
        dataForCheckout.voucherCode = voucherCode;

        addPayment(firstCheckout.id);
        completeCheckout(firstCheckout.id);
        createCheckoutWithVoucher(dataForCheckout)
          .its("addPromoCodeResp.errors.0")
          .should("include", { field: "promoCode" })
          .and("include", {
            message: "Voucher is not applicable to this checkout.",
          });

        // Create new checkout as other not logged in customer - voucher should be available for other customer

        window.sessionStorage.setItem("token", "");
        dataForCheckout.auth = "token";
        dataForCheckout.email = "newUser@example.com";

        createCheckoutWithVoucher(dataForCheckout)
          .its("addPromoCodeResp.errors")
          .should("be.be.empty");
      });
    },
  );

  it(
    "should be able to create voucher with limit to staff only. TC: SALEOR_1909",
    { tags: ["@vouchers", "@allEnv", "@stable"] },
    () => {
      const voucherCode = `${startsWith}${faker.datatype.number()}`;
      dataForCheckout.auth = "auth";
      let firstCheckout;

      loginAndCreateCheckoutForVoucherWithDiscount({
        discount: discountOptions.PERCENTAGE,
        voucherValue,
        voucherCode,
        channelName: defaultChannel.name,
        dataForCheckout,
        onlyStaff: true,
      }).then(({ checkout, addPromoCodeResp }) => {
        expect(addPromoCodeResp.errors).to.be.empty;
        firstCheckout = checkout;
        dataForCheckout.voucherCode = voucherCode;

        addPayment(firstCheckout.id);
        completeCheckout(firstCheckout.id);

        // Create new checkout as other not logged in customer - voucher should be not available for other customer

        window.sessionStorage.setItem("token", "");
        dataForCheckout.auth = "token";
        dataForCheckout.email = "newUser@example.com";

        createCheckoutWithVoucher(dataForCheckout)
          .its("addPromoCodeResp.errors.0")
          .should("include", { field: "promoCode" })
          .and("include", {
            message: "Voucher is not applicable to this checkout.",
          });
      });
    },
  );

  it(
    "should be able to create voucher with minimum value of order. TC: SALEOR_1910",
    { tags: ["@vouchers", "@allEnv", "@stable"] },
    () => {
      const voucherCode = `${startsWith}${faker.datatype.number()}`;
      const minOrderValue = productPrice * 1.5;
      dataForCheckout.productQuantity = 1;

      loginAndCreateCheckoutForVoucherWithDiscount({
        discount: discountOptions.PERCENTAGE,
        voucherValue,
        voucherCode,
        channelName: defaultChannel.name,
        dataForCheckout,
        minOrderValue,
      })
        .its("addPromoCodeResp.errors.0")
        .should("include", { field: "promoCode" })
        .and("include", {
          message: "Voucher is not applicable to this checkout.",
        });
      dataForCheckout.voucherCode = voucherCode;
      dataForCheckout.productQuantity = 2;

      createCheckoutWithVoucher(dataForCheckout)
        .its("addPromoCodeResp.errors")
        .should("be.be.empty");
    },
  );

  it(
    "should create voucher with min product quantity. TC: SALEOR_1911",
    { tags: ["@vouchers", "@allEnv", "@stable"] },
    () => {
      const voucherCode = `${startsWith}${faker.datatype.number()}`;
      dataForCheckout.productQuantity = 1;

      loginAndCreateCheckoutForVoucherWithDiscount({
        discount: discountOptions.PERCENTAGE,
        voucherValue,
        voucherCode,
        channelName: defaultChannel.name,
        dataForCheckout,
        minAmountOfItems: 2,
      })
        .its("addPromoCodeResp.errors.0")
        .should("include", { field: "promoCode" })
        .and("include", {
          message: "Voucher is not applicable to this checkout.",
        });
      dataForCheckout.voucherCode = voucherCode;
      dataForCheckout.productQuantity = 2;

      createCheckoutWithVoucher(dataForCheckout)
        .its("addPromoCodeResp.errors")
        .should("be.be.empty");
    },
  );
});
