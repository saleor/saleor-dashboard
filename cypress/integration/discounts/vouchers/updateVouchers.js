/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { VOUCHERS_SELECTORS } from "../../../elements/discounts/vouchers";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { voucherDetailsUrl } from "../../../fixtures/urlList";
import { createChannel } from "../../../support/api/requests/Channels";
import * as channelsUtils from "../../../support/api/utils/channelsUtils";
import {
  createVoucherInChannel,
  deleteVouchersStartsWith
} from "../../../support/api/utils/discounts/vouchersUtils";
import { createCheckoutWithVoucher } from "../../../support/api/utils/ordersUtils";
import * as productsUtils from "../../../support/api/utils/products/productsUtils";
import filterTests from "../../../support/filterTests";
import { formatDate } from "../../../support/formatData/formatDate";
import {
  dateTypes,
  setVoucherDate
} from "../../../support/pages/discounts/vouchersPage";

filterTests({ definedTags: ["all"] }, () => {
  describe("Vouchers discounts", () => {
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

    xit("should delete voucher", () => {
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
          const errorField = addPromoCodeResp.checkoutErrors[0].field;
          expect(errorField).to.be.eq("promoCode");
        });
    });

    xit("should update voucher", () => {
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

    xit("should set date on voucher", () => {
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
          const errorField = addPromoCodeResp.checkoutErrors[0].field;
          expect(errorField).to.be.eq("promoCode");
          setVoucherDate({ voucherId: voucher.id, startDate: todayDate });
          dataForCheckout.voucherCode = voucher.code;
          createCheckoutWithVoucher(dataForCheckout);
        })
        .then(({ addPromoCodeResp }) => {
          expect(addPromoCodeResp.checkoutErrors).to.be.empty;
        });
    });

    it("should set end date on voucher", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const voucherValue = 50;
      const today = new Date();
      const yesterday = new Date(today);
      const todayDate = formatDate(today);
      const yesterdayDate = formatDate(
        yesterday.setDate(yesterday.getDate() - 1)
      );

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
          setVoucherDate({ voucherId: voucher.id, endDate: yesterdayDate });
          dataForCheckout.voucherCode = voucher.code;
          createCheckoutWithVoucher(dataForCheckout);
        })
        .then(({ addPromoCodeResp }) => {
          const errorField = addPromoCodeResp.checkoutErrors[0].field;
          expect(errorField).to.be.eq("promoCode");
          setVoucherDate({ voucherId: voucher.id, endDate: todayDate });
          dataForCheckout.voucherCode = voucher.code;
          createCheckoutWithVoucher(dataForCheckout);
        })
        .then(({ addPromoCodeResp }) => {
          expect(addPromoCodeResp.checkoutErrors).to.be.empty;
        });
    });
  });
});
