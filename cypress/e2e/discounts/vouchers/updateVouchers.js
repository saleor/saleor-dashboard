/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { VOUCHERS_SELECTORS } from "../../../elements/discounts/vouchers";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { voucherDetailsUrl } from "../../../fixtures/urlList";
import {
  createVoucherInChannel,
  deleteVouchersStartsWith
} from "../../../support/api/utils/discounts/vouchersUtils";
import { createCheckoutWithVoucher } from "../../../support/api/utils/ordersUtils";
import * as productsUtils from "../../../support/api/utils/products/productsUtils";
import filterTests from "../../../support/filterTests";
import { formatDate, formatTime } from "../../../support/formatData/formatDate";
import { setVoucherDate } from "../../../support/pages/discounts/vouchersPage";

filterTests({ definedTags: ["all"] }, () => {
  describe("As an admin I want to update vouchers", () => {
    const startsWith = "CyVou-";
    const productPrice = 100;
    const shippingPrice = 100;

    let defaultChannel;
    let product;
    let dataForCheckout;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
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
            product: productResp
          }) => {
            defaultChannel = channel;
            product = productResp;

            dataForCheckout = {
              channelSlug: defaultChannel.slug,
              variantsList: variantsResp,
              address: addressResp,
              shippingMethodName: shippingMethodResp.name,
              auth: "token"
            };
          }
        );
    });

    it("should delete voucher. TC: SALEOR_1905", () => {
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
          dataForCheckout.voucherCode = voucher.code;
          createCheckoutWithVoucher(dataForCheckout);
        })
        .then(({ addPromoCodeResp }) => {
          const errorField = addPromoCodeResp.errors[0].field;
          expect(errorField).to.be.eq("promoCode");
        });
    });

    it("should update voucher. TC: SALEOR_1906", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const voucherValue = 50;
      const voucherUpdatedValue = 20;
      const expectedOrderAmount =
        productPrice +
        shippingPrice -
        (productPrice * voucherUpdatedValue) / 100;

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
            .addAliasToGraphRequest("VoucherUpdate")
            .get(VOUCHERS_SELECTORS.percentageDiscountRadioButton)
            .click()
            .get(VOUCHERS_SELECTORS.discountValueInputs)
            .clearAndType(voucherUpdatedValue)
            .get(BUTTON_SELECTORS.confirm)
            .click()
            .wait("@VoucherUpdate");
          dataForCheckout.voucherCode = voucher.code;
          createCheckoutWithVoucher(dataForCheckout);
        })
        .then(({ addPromoCodeResp }) => {
          const amount = addPromoCodeResp.checkout.totalPrice.gross.amount;
          expect(amount).to.be.eq(expectedOrderAmount);
        });
    });

    it("should set date on voucher. TC: SALEOR_1912", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const voucherValue = 50;
      const today = new Date();
      const tomorrow = new Date(today);
      const todayDate = formatDate(today);
      const tomorrowDate = formatDate(tomorrow.setDate(tomorrow.getDate() + 1));

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
          setVoucherDate({ voucherId: voucher.id, startDate: tomorrowDate });
          dataForCheckout.voucherCode = voucher.code;
          createCheckoutWithVoucher(dataForCheckout);
        })
        .then(({ addPromoCodeResp }) => {
          const errorField = addPromoCodeResp.errors[0].field;
          expect(errorField).to.be.eq("promoCode");
          setVoucherDate({ voucherId: voucher.id, startDate: todayDate });
          dataForCheckout.voucherCode = voucher.code;
          createCheckoutWithVoucher(dataForCheckout);
        })
        .then(({ addPromoCodeResp }) => {
          expect(addPromoCodeResp.errors).to.be.empty;
        });
    });

    it("should set end date on voucher. TC: SALEOR_1913", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const voucherValue = 50;
      const today = new Date();
      const todayDate = formatDate(today);
      const tomorrow = new Date(today);
      const tomorrowDate = formatDate(tomorrow.setDate(tomorrow.getDate() + 1));

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
          setVoucherDate({
            voucherId: voucher.id,
            endDate: todayDate,
            endTime: formatTime(today),
            hasEndDate: true
          });
          dataForCheckout.voucherCode = voucher.code;
          createCheckoutWithVoucher(dataForCheckout);
        })
        .then(({ addPromoCodeResp }) => {
          const errorField = addPromoCodeResp.errors[0].field;
          expect(errorField).to.be.eq("promoCode");
          setVoucherDate({
            voucherId: voucher.id,
            endDate: tomorrowDate,
            endTime: formatTime(tomorrow)
          });
          dataForCheckout.voucherCode = voucher.code;
          createCheckoutWithVoucher(dataForCheckout);
        })
        .then(({ addPromoCodeResp }) => {
          expect(addPromoCodeResp.errors).to.be.empty;
        });
    });

    it("should set country on voucher. TC: SALEOR_1914", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const voucherValue = 50;

      let voucher;

      cy.clearSessionData().loginUserViaRequest();
      createVoucherInChannel({
        name,
        productId: product.id,
        channelId: defaultChannel.id,
        value: voucherValue,
        type: "SHIPPING",
        country: "US"
      })
        .then(voucherResp => {
          voucher = voucherResp;
          expect(voucher.id).to.be.ok;
          dataForCheckout.voucherCode = voucher.code;
          createCheckoutWithVoucher(dataForCheckout);
        })
        .then(({ addPromoCodeResp }) => {
          expect(addPromoCodeResp.errors).to.be.empty;
          cy.visit(voucherDetailsUrl(voucher.id))
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
          createCheckoutWithVoucher(dataForCheckout);
        })
        .then(({ addPromoCodeResp }) => {
          const errorField = addPromoCodeResp.errors[0].field;
          expect(errorField).to.be.eq("promoCode");
        });
    });
  });
});
