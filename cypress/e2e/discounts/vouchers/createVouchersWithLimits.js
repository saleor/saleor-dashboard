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
  const startsWith = "CyVou-";
  const productPrice = 100;
  const shippingPrice = 100;

  let defaultChannel;
  let shippingMethod;
  let variants;
  let address;
  let dataForCheckout;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    channelsUtils.deleteChannelsStartsWith(startsWith);
    deleteVouchersStartsWith(startsWith);
    const name = `${startsWith}${faker.datatype.number()}`;
    productsUtils
      .createProductWithShipping({ name, productPrice, shippingPrice })
      .then(
        ({
          variantsList: variantsResp,
          defaultChannel: channel,
          shippingMethod: shippingMethodResp,
          address: addressResp,
        }) => {
          variants = variantsResp;
          defaultChannel = channel;
          shippingMethod = shippingMethodResp;
          address = addressResp;
          dataForCheckout = {
            channelSlug: defaultChannel.slug,
            variantsList: variants,
            address,
            shippingMethodName: shippingMethod.name,
            auth: "token",
          };
        },
      );
  });

  it(
    "should be able to create voucher with limited number of times discount can be used in total. TC: SALEOR_1907",
    { tags: ["@vouchers", "@allEnv", "@stable"] },
    () => {
      const voucherCode = `${startsWith}${faker.datatype.number()}`;
      const voucherValue = 50;
      const usageLimit = 1;
      let firstCheckout;

      loginAndCreateCheckoutForVoucherWithDiscount({
        discount: discountOptions.PERCENTAGE,
        voucherValue,
        voucherCode,
        channelName: defaultChannel.name,
        dataForCheckout,
        usageLimit,
      })
        .then(({ checkout, addPromoCodeResp }) => {
          expect(addPromoCodeResp.errors).to.be.empty;
          firstCheckout = checkout;
          dataForCheckout.voucherCode = voucherCode;
          addPayment(firstCheckout.id);
        })
        .then(() => {
          completeCheckout(firstCheckout.id);
        })
        .then(() => {
          createCheckoutWithVoucher(dataForCheckout);
        })
        .then(({ addPromoCodeResp }) => {
          const errorField = addPromoCodeResp.errors[0].field;
          expect(errorField, "error in promo code should occur").to.be.eq(
            "promoCode",
          );
        });
    },
  );

  it(
    "should be able to create voucher with limit to one use per customer. TC: SALEOR_1908",
    { tags: ["@vouchers", "@allEnv", "@stable"] },
    () => {
      const voucherCode = `${startsWith}${faker.datatype.number()}`;
      const voucherValue = 50;
      dataForCheckout.auth = "token";
      let firstCheckout;

      loginAndCreateCheckoutForVoucherWithDiscount({
        discount: discountOptions.PERCENTAGE,
        voucherValue,
        voucherCode,
        channelName: defaultChannel.name,
        dataForCheckout,
        applyOnePerCustomer: true,
      })
        .then(({ checkout, addPromoCodeResp }) => {
          expect(addPromoCodeResp.errors).to.be.empty;

          dataForCheckout.voucherCode = voucherCode;
          firstCheckout = checkout;
          addPayment(firstCheckout.id);
        })
        .then(() => {
          completeCheckout(firstCheckout.id);
        })
        .then(() => {
          createCheckoutWithVoucher(dataForCheckout);
        })
        .then(({ addPromoCodeResp }) => {
          const errorField = addPromoCodeResp.errors[0].field;
          expect(errorField, "error in promo code should occur").to.be.eq(
            "promoCode",
          );

          // Create new checkout as other not logged in customer - voucher should be available for other customer

          cy.clearSessionData();
          dataForCheckout.email = "newUser@example.com";
          createCheckoutWithVoucher(dataForCheckout);
        })
        .then(({ addPromoCodeResp }) => {
          const errorField = addPromoCodeResp.errors;
          expect(errorField, "No errors when adding promo code").to.be.empty;
        });
    },
  );

  xit(
    "should be able to create voucher with limit to staff only. TC: SALEOR_1909",
    { tags: ["@vouchers", "@allEnv"] },
    () => {
      const voucherCode = `${startsWith}${faker.datatype.number()}`;
      const voucherValue = 50;
      dataForCheckout.auth = "auth";
      let firstCheckout;

      loginAndCreateCheckoutForVoucherWithDiscount({
        discount: discountOptions.PERCENTAGE,
        voucherValue,
        voucherCode,
        channelName: defaultChannel.name,
        dataForCheckout,
        onlyStaff: true,
      })
        .then(({ checkout, addPromoCodeResp }) => {
          expect(addPromoCodeResp.errors).to.be.empty;
          dataForCheckout.voucherCode = voucherCode;
          firstCheckout = checkout;
          addPayment(firstCheckout.id);
        })
        .then(() => {
          completeCheckout(firstCheckout.id);
        })
        .then(() => {
          dataForCheckout.auth = "token";
          createCheckoutWithVoucher(dataForCheckout);
        })
        .then(({ addPromoCodeResp }) => {
          const errorField = addPromoCodeResp.errors[0].field;
          expect(errorField, "error in promo code should occur").to.be.eq(
            "promoCode",
          );
        });
    },
  );

  xit(
    "should be able to create voucher with minimum value of order. TC: SALEOR_1910",
    { tags: ["@vouchers", "@allEnv"] },
    () => {
      const voucherCode = `${startsWith}${faker.datatype.number()}`;
      const voucherValue = 50;
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
        .then(({ addPromoCodeResp }) => {
          const errorField = addPromoCodeResp.errors[0].field;
          dataForCheckout.voucherCode = voucherCode;

          expect(errorField, "error in promo code should occur").to.be.eq(
            "promoCode",
          );
          dataForCheckout.productQuantity = 2;
          createCheckoutWithVoucher(dataForCheckout);
        })
        .then(({ addPromoCodeResp }) => {
          const errorField = addPromoCodeResp.errors;
          expect(errorField, "No errors when adding promo code").to.be.empty;
        });
    },
  );

  xit("should create voucher with min product quantity. TC: SALEOR_1911", () => {
    const voucherCode = `${startsWith}${faker.datatype.number()}`;
    const voucherValue = 50;
    const minAmountOfItems = 2;
    dataForCheckout.productQuantity = 1;

    loginAndCreateCheckoutForVoucherWithDiscount({
      discount: discountOptions.PERCENTAGE,
      voucherValue,
      voucherCode,
      channelName: defaultChannel.name,
      dataForCheckout,
      minAmountOfItems,
    })
      .then(({ addPromoCodeResp }) => {
        const errorField = addPromoCodeResp.errors[0].field;
        dataForCheckout.voucherCode = voucherCode;

        expect(errorField, "error in promo code should occur").to.be.eq(
          "promoCode",
        );
        dataForCheckout.productQuantity = 2;
        createCheckoutWithVoucher(dataForCheckout);
      })
      .then(({ addPromoCodeResp }) => {
        const errorField = addPromoCodeResp.errors;
        expect(errorField, "No errors when adding promo code").to.be.empty;
      });
  });
});
