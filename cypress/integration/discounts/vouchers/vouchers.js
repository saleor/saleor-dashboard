// / <reference types="cypress"/>
// / <reference types="../../../support"/>

import faker from "faker";

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
          const errorField = addPromoCodeResp.errors[0].field;
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
  });
});
