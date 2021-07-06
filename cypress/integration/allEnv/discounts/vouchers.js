// <reference types="cypress" />
import faker from "faker";

import { createChannel } from "../../../apiRequests/Channels";
import { ONE_PERMISSION_USERS } from "../../../Data/users";
import {
  createVoucher,
  discountOptions
} from "../../../steps/discounts/vouchersSteps";
import { urlList } from "../../../url/urlList";
import * as channelsUtils from "../../../utils/channelsUtils";
import { deleteVouchersStartsWith } from "../../../utils/discounts/vouchersUtils";
import { createCheckoutWithVoucher } from "../../../utils/ordersUtils";
import * as productsUtils from "../../../utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../../utils/shippingUtils";

describe("Vouchers discounts", () => {
  const startsWith = "CyVou-";
  const productPrice = 100;
  const shippingPrice = 100;

  let defaultChannel;
  let productType;
  let attribute;
  let category;
  let shippingMethod;
  let variants;
  let address;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    channelsUtils.deleteChannelsStartsWith(startsWith);
    productsUtils.deleteProductsStartsWith(startsWith);
    deleteShippingStartsWith(startsWith);
    deleteVouchersStartsWith(startsWith);

    const name = `${startsWith}${faker.datatype.number()}`;

    productsUtils
      .createTypeAttributeAndCategoryForProduct(name)
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
      .then(({ shippingMethod: shippingMethodResp, warehouse: warehouse }) => {
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
      })
      .then(({ variantsList: variantsResp }) => (variants = variantsResp));
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
    createChannel({ name: randomName })
      .then(channel => {
        createVoucher({
          voucherCode: randomName,
          voucherValue,
          discountOption: discountOptions.PERCENTAGE,
          channelName: channel.name
        });
        createCheckoutForCreatedVoucher(randomName);
      })
      .then(resp => {
        const errorField = resp.checkoutErrors[0].field;
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
    createVoucher({
      voucherCode,
      voucherValue,
      discountOption: discount,
      channelName: defaultChannel.name
    });
    return createCheckoutForCreatedVoucher(voucherCode).its(
      "checkout.totalPrice.gross.amount"
    );
  }
});
