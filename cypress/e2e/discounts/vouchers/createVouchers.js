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
import filterTests from "../../../support/filterTests";
import {
  createVoucher,
  discountOptions,
  loginAndCreateCheckoutForVoucherWithDiscount,
} from "../../../support/pages/discounts/vouchersPage";

describe("As an admin I want to create voucher", () => {
  const startsWith = "CyVou-";
  const productPrice = 100;
  const shippingPrice = 100;

  let defaultChannel;
  let createdChannel;
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
          createChannel({ name });
        },
      )
      .then(channel => {
        createdChannel = channel;
        dataForCheckout = {
          channelSlug: defaultChannel.slug,
          variantsList: variants,
          address,
          shippingMethodName: shippingMethod.name,
          auth: "token",
        };
      });
  });

  it(
    "should be able to create fixed price voucher. TC: SALEOR_1901",
    { tags: ["@vouchers", "@allEnv", "@stable"] },
    () => {
      const voucherValue = 50;
      const voucherCode = `${startsWith}${faker.datatype.number()}`;
      const expectedAmount = productPrice + shippingPrice - voucherValue;
      let checkout;

      loginAndCreateCheckoutForVoucherWithDiscount({
        discount: discountOptions.FIXED,
        voucherValue,
        voucherCode,
        channelName: defaultChannel.name,
        dataForCheckout,
      })
        .then(({ addPromoCodeResp, checkout: checkoutResp }) => {
          expect(addPromoCodeResp.checkout.totalPrice.gross.amount).to.be.eq(
            expectedAmount,
          );
          dataForCheckout.voucherCode = voucherCode;
          checkout = checkoutResp;
          addPayment(checkout.id);
        })
        .then(() => {
          completeCheckout(checkout.id);
        })
        .then(({ order }) => {
          expect(order.id).to.be.ok;
        });
    },
  );

  it(
    "should be able to create percentage voucher. TC: SALEOR_1902",
    { tags: ["@vouchers", "@allEnv", "@stable"] },
    () => {
      const voucherValue = 50;
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
      })
        .then(({ addPromoCodeResp, checkout: checkoutResp }) => {
          expect(addPromoCodeResp.checkout.totalPrice.gross.amount).to.be.eq(
            expectedAmount,
          );
          dataForCheckout.voucherCode = voucherCode;
          checkout = checkoutResp;
          addPayment(checkout.id);
        })
        .then(() => {
          completeCheckout(checkout.id);
        })
        .then(({ order }) => {
          expect(order.id).to.be.ok;
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
      })
        .then(({ addPromoCodeResp, checkout: checkoutResp }) => {
          expect(addPromoCodeResp.checkout.totalPrice.gross.amount).to.be.eq(
            expectedAmount,
          );
          dataForCheckout.voucherCode = voucherCode;
          checkout = checkoutResp;
          addPayment(checkout.id);
        })
        .then(() => {
          completeCheckout(checkout.id);
        })
        .then(({ order }) => {
          expect(order.id).to.be.ok;
        });
    },
  );

  it(
    "should be able to create voucher not available for selected channel. TC: SALEOR_1904",
    { tags: ["@vouchers", "@allEnv", "@stable"] },
    () => {
      const randomName = `${startsWith}${faker.datatype.number()}`;
      const voucherValue = 50;

      cy.clearSessionData()
        .loginUserViaRequest()
        .visit(urlList.vouchers);
      cy.expectSkeletonIsVisible();
      createVoucher({
        voucherCode: randomName,
        voucherValue,
        discountOption: discountOptions.PERCENTAGE,
        channelName: createdChannel.name,
      });
      dataForCheckout.voucherCode = randomName;
      createCheckoutWithVoucher(dataForCheckout).then(
        ({ addPromoCodeResp }) => {
          const errorField = addPromoCodeResp.errors[0].field;
          expect(errorField).to.be.eq("promoCode");
        },
      );
    },
  );
});
