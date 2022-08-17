/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { VOUCHERS_SELECTORS } from "../../../elements/discounts/vouchers";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { voucherDetailsUrl } from "../../../fixtures/urlList";
import {
  createVoucherInChannel,
  deleteVouchersStartsWith,
} from "../../../support/api/utils/discounts/vouchersUtils";
import { createCheckoutWithVoucher } from "../../../support/api/utils/ordersUtils";
import * as productsUtils from "../../../support/api/utils/products/productsUtils";
import { formatDate, formatTime } from "../../../support/formatData/formatDate";
import { setVoucherDate } from "../../../support/pages/discounts/vouchersPage";

describe("As an admin I want to update vouchers", () => {
  const startsWith = "UpdateVou-";
  const productPrice = 100;
  const shippingPrice = 100;
  const voucherValue = 50;

  let defaultChannel;
  let product;
  let dataForCheckout;

  before(() => {
    const name = `${startsWith}${faker.datatype.number()}`;

    cy.clearSessionData().loginUserViaRequest();
    deleteVouchersStartsWith(startsWith);
    productsUtils
      .createProductWithShipping({ name, productPrice, shippingPrice })
      .then(
        ({
          variantsList: variantsResp,
          defaultChannel: channel,
          shippingMethod: shippingMethodResp,
          address: addressResp,
          product: productResp,
        }) => {
          defaultChannel = channel;
          product = productResp;

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
    "should delete voucher. TC: SALEOR_1905",
    { tags: ["@vouchers", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;

      cy.clearSessionData().loginUserViaRequest();
      createVoucherInChannel({
        name,
        productId: product.id,
        channelId: defaultChannel.id,
        value: voucherValue,
      }).then(voucherResp => {
        expect(voucherResp.voucher.id).to.be.ok;

        cy.visit(voucherDetailsUrl(voucherResp.voucher.id))
          .addAliasToGraphRequest("VoucherDelete")
          .get(BUTTON_SELECTORS.deleteButton)
          .click()
          .get(BUTTON_SELECTORS.submit)
          .click()
          .wait("@VoucherDelete");

        dataForCheckout.voucherCode = voucherResp.voucher.code;
        window.sessionStorage.setItem("token", "");
        dataForCheckout.auth = "token";

        createCheckoutWithVoucher(dataForCheckout)
          .its("addPromoCodeResp.errors.0")
          .should("include", { field: "promoCode" })
          .and("include", { message: "Promo code is invalid" });
      });
    },
  );

  it(
    "should update voucher. TC: SALEOR_1906",
    { tags: ["@vouchers", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const voucherUpdatedValue = 20;
      const expectedOrderAmount =
        productPrice +
        shippingPrice -
        (productPrice * voucherUpdatedValue) / 100;

      cy.clearSessionData().loginUserViaRequest();
      createVoucherInChannel({
        name,
        productId: product.id,
        channelId: defaultChannel.id,
        value: voucherValue,
      }).then(voucherResp => {
        expect(voucherResp.voucher.id).to.be.ok;

        cy.visit(voucherDetailsUrl(voucherResp.voucher.id))
          .addAliasToGraphRequest("VoucherUpdate")
          .get(VOUCHERS_SELECTORS.percentageDiscountRadioButton)
          .click()
          .get(VOUCHERS_SELECTORS.discountValueInputs)
          .clearAndType(voucherUpdatedValue)
          .get(BUTTON_SELECTORS.confirm)
          .click()
          .wait("@VoucherUpdate");

        dataForCheckout.voucherCode = voucherResp.voucher.code;
        window.sessionStorage.setItem("token", "");
        dataForCheckout.auth = "token";

        createCheckoutWithVoucher(dataForCheckout)
          .its("addPromoCodeResp.checkout.totalPrice.gross.amount")
          .should("eq", expectedOrderAmount);
      });
    },
  );

  it(
    "should set date on voucher. TC: SALEOR_1912",
    { tags: ["@vouchers", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const todayDate = formatDate(new Date());
      const tomorrowDate = formatDate(
        new Date().setDate(new Date().getDate() + 1),
      );

      cy.clearSessionData().loginUserViaRequest();
      createVoucherInChannel({
        name,
        productId: product.id,
        channelId: defaultChannel.id,
        value: voucherValue,
      }).then(voucherResp => {
        expect(voucherResp.voucher.id).to.be.ok;

        setVoucherDate({
          voucherId: voucherResp.voucher.id,
          startDate: tomorrowDate,
        });
        dataForCheckout.voucherCode = voucherResp.voucher.code;

        createCheckoutWithVoucher(dataForCheckout)
          .its("addPromoCodeResp.errors.0")
          .should("include", { field: "promoCode" })
          .and("include", { message: "Promo code is invalid" });
        setVoucherDate({
          voucherId: voucherResp.voucher.id,
          startDate: todayDate,
        });
        window.sessionStorage.setItem("token", "");
        dataForCheckout.auth = "token";

        createCheckoutWithVoucher(dataForCheckout)
          .its("addPromoCodeResp.errors")
          .should("be.be.empty");
      });
    },
  );

  it(
    "should set end date on voucher. TC: SALEOR_1913",
    { tags: ["@vouchers", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const todayDate = formatDate(new Date());
      const tomorrowDate = formatDate(
        new Date().setDate(new Date().getDate() + 1),
      );

      cy.clearSessionData().loginUserViaRequest();
      createVoucherInChannel({
        name,
        productId: product.id,
        channelId: defaultChannel.id,
        value: voucherValue,
      }).then(voucherResp => {
        expect(voucherResp.voucher.id).to.be.ok;

        setVoucherDate({
          voucherId: voucherResp.voucher.id,
          endDate: todayDate,
          endTime: formatTime(new Date()),
          hasEndDate: true,
        });
        dataForCheckout.voucherCode = voucherResp.voucher.code;
        window.sessionStorage.setItem("token", "");
        dataForCheckout.auth = "token";

        createCheckoutWithVoucher(dataForCheckout)
          .its("addPromoCodeResp.errors.0")
          .should("include", { field: "promoCode" })
          .and("include", { message: "Promo code is invalid" });
        setVoucherDate({
          voucherId: voucherResp.voucher.id,
          endDate: tomorrowDate,
          endTime: formatTime(new Date()),
        });
        createCheckoutWithVoucher(dataForCheckout)
          .its("addPromoCodeResp.errors")
          .should("be.be.empty");
      });
    },
  );

  it(
    "should set country on voucher. TC: SALEOR_1914",
    { tags: ["@vouchers", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;

      cy.clearSessionData().loginUserViaRequest();
      createVoucherInChannel({
        name,
        productId: product.id,
        channelId: defaultChannel.id,
        value: voucherValue,
        type: "SHIPPING",
        country: "US",
      }).then(voucherResp => {
        expect(voucherResp.voucher.id).to.be.ok;
        dataForCheckout.voucherCode = voucherResp.voucher.code;
        window.sessionStorage.setItem("token", "");
        dataForCheckout.auth = "token";

        createCheckoutWithVoucher(dataForCheckout)
          .its("addPromoCodeResp.errors")
          .should("be.be.empty");
        cy.visit(voucherDetailsUrl(voucherResp.voucher.id))
          .get(VOUCHERS_SELECTORS.shippingDiscountRadioButton)
          .click()
          .get(VOUCHERS_SELECTORS.countriesDropdownIcon)
          .click()
          .get(BUTTON_SELECTORS.deleteIcon)
          .click()
          .get(BUTTON_SELECTORS.deleteIcon)
          .should("not.exist")
          .get(VOUCHERS_SELECTORS.assignCountryButton)
          .click()
          .assignElements("Poland", false)
          .addAliasToGraphRequest("VoucherUpdate")
          .get(BUTTON_SELECTORS.confirm)
          .click()
          .wait("@VoucherUpdate");
        createCheckoutWithVoucher(dataForCheckout)
          .its("addPromoCodeResp.errors.0")
          .should("include", { field: "promoCode" })
          .and("include", {
            message: "Voucher is not applicable to this checkout.",
          });
      });
    },
  );
});
