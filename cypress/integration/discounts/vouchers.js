/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { urlList, voucherDetailsUrl } from "../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../fixtures/users";
import { createChannel } from "../../support/api/requests/Channels";
import * as channelsUtils from "../../support/api/utils/channelsUtils";
import {
  createVoucherInChannel,
  deleteVouchersStartsWith
} from "../../support/api/utils/discounts/vouchersUtils";
import { createCheckoutWithVoucher } from "../../support/api/utils/ordersUtils";
import * as productsUtils from "../../support/api/utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../support/api/utils/shippingUtils";
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
    let productType;
    let attribute;
    let category;
    let shippingMethod;
    let variants;
    let product;
    let address;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      channelsUtils.deleteChannelsStartsWith(startsWith);
      productsUtils.deleteProductsStartsWith(startsWith);
      deleteShippingStartsWith(startsWith);
      deleteVouchersStartsWith(startsWith);

      const name = `${startsWith}${faker.datatype.number()}`;

      productsUtils
        .createTypeAttributeAndCategoryForProduct({ name })
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
        .then(({ variantsList: variantsResp, product: productResp }) => {
          product = productResp;
          variants = variantsResp;
          createChannel({ name });
        })
        .then(channel => {
          createdChannel = channel;
        });
    });

    it("should create percentage voucher", () => {
      const voucherValue = 50;

      loginAndCreateCheckoutForVoucherWithDiscount(
        discountOptions.PERCENTAGE,
        voucherValue
      ).then(amount => {
        const expectedAmount =
          (productPrice * voucherValue) / 100 + shippingPrice;
        expect(amount).to.be.eq(expectedAmount);
      });
    });

    it("should create fixed price voucher", () => {
      const voucherValue = 50;
      loginAndCreateCheckoutForVoucherWithDiscount(
        discountOptions.FIXED,
        voucherValue
      ).then(amount => {
        const expectedAmount = productPrice + shippingPrice - voucherValue;
        expect(amount).to.be.eq(expectedAmount);
      });
    });

    it("should create free shipping voucher", () => {
      loginAndCreateCheckoutForVoucherWithDiscount(
        discountOptions.SHIPPING,
        null
      ).then(amount => {
        const expectedAmount = productPrice;
        expect(amount).to.be.eq(expectedAmount);
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
        })
        .then(resp => {
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
        shippingMethodId: shippingMethod.id,
        voucherCode,
        auth: "token"
      });
    }

    function loginAndCreateCheckoutForVoucherWithDiscount(
      discount,
      voucherValue
    ) {
      const voucherCode = `${startsWith}${faker.datatype.number()}`;

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
