// <reference types="cypress" />
import faker from "faker";

import {
  createVoucher,
  discountOptions
} from "../../steps/discounts/vouchersSteps";
import { urlList } from "../../url/urlList";
import * as channelsUtils from "../../utils/channelsUtils";
import { deleteVouchersStartsWith } from "../../utils/discounts/vouchersUtils";
import { createCheckoutWithVoucher } from "../../utils/ordersUtils";
import * as productsUtils from "../../utils/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../utils/shippingUtils";

describe("Vouchers discounts", () => {
  const startsWith = "Cy-";
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

    const name = `${startsWith}${faker.random.number()}`;

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
      .then(({ variants: variantsResp }) => (variants = variantsResp));
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
    cy.visit(urlList.vouchers);
  });

  it("should create percentage voucher", () => {
    const voucherCode = `${startsWith}${faker.random.number()}`;
    const voucherValue = 50;

    createVoucher({
      voucherCode,
      voucherValue,
      discountOption: discountOptions.PERCENTAGE,
      channelName: defaultChannel.name
    });
    createCheckoutForCreatedVoucher(voucherCode)
      .its("checkout.totalPrice.gross.amount")
      .then(amount => {
        const expectedAmount =
          (productPrice * voucherValue) / 100 + shippingPrice;
        expect(amount).to.be.eq(expectedAmount);
      });
  });
  it("should create fixed price voucher", () => {
    const voucherCode = `${startsWith}${faker.random.number()}`;
    const voucherValue = 50;

    createVoucher({
      voucherCode,
      voucherValue,
      discountOption: discountOptions.FIXED,
      channelName: defaultChannel.name
    });
    createCheckoutForCreatedVoucher(voucherCode)
      .its("checkout.totalPrice.gross.amount")
      .then(amount => {
        const expectedAmount = productPrice + shippingPrice - voucherValue;
        expect(amount).to.be.eq(expectedAmount);
      });
  });

  // Test should pass after fixing - SALEOR-1629 bug
  xit("should create free shipping voucher", () => {
    const voucherCode = `${startsWith}${faker.random.number()}`;

    createVoucher({
      voucherCode,
      discountOption: discountOptions.SHIPPING,
      channelName: defaultChannel.name
    });
    createCheckoutForCreatedVoucher(voucherCode)
      .its("checkout.totalPrice.gross.amount")
      .then(amount => {
        const expectedAmount = productPrice;
        expect(amount).to.be.eq(expectedAmount);
      });
  });

  it("should create voucher not available for selected channel", () => {
    const randomName = `${startsWith}${faker.random.number()}`;
    const voucherValue = 50;

    channelsUtils
      .createChannel({ name: randomName })
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
});
