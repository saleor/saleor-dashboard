// <reference types="cypress" />

import { VOUCHERS_SELECTORS } from "../../elements/discounts/vouchers";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { selectChannelInDetailsPages } from "../../steps/channelsSteps";
import { urlList } from "../../url/urlList";
import * as channelsUtils from "../../utils/channelsUtils";
import * as productsUtils from "../../utils/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../utils/shippingUtils";

describe("Vouchers discounts", () => {
  const productPrice = 100;

  let defaultChannel;
  let productType;
  let attribute;
  let category;
  let warehouse;
  let product;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    channelsUtils.deleteChannelsStartsWith(startsWith);
    productsUtils.deleteProductsStartsWith(startsWith);
    deleteShippingStartsWith(startsWith);

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
        createShipping({
          channelId: defaultChannel.id,
          name,
          address: addresses.plAddress,
          price: 100
        });
      })
      .then(({ warehouse: warehouseResp }) => {
        warehouse = warehouseResp;
        productsUtils.createProductInChannel({
          name: saleName,
          channelId: defaultChannel.id,
          warehouseId: warehouse.id,
          productTypeId: productType.id,
          attributeId: attribute.id,
          categoryId: category.id,
          price: productPrice
        });
      })
      .then(({ product: productResp }) => (product = productResp));
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
    cy.visit(urlList.vouchers);
  });

  it("should create percentage voucher", () => {
    const voucherValue = 50;

    cy.get(VOUCHERS_SELECTORS.createVoucherButton).click();
    selectChannelInDetailsPages(defaultChannel.name);
    cy.get(VOUCHERS_SELECTORS.generateCode)
      .click()
      .get(VOUCHERS_SELECTORS.percentageDiscountRadioButton)
      .click()
      .get(VOUCHERS_SELECTORS.discountValueInputs)
      .type(voucherValue)
      .get(BUTTON_SELECTORS.submit)
      .click();
  });
  xit("should create fixed price voucher", () => {
    // TODO
  });
  xit("should create free shipping voucher", () => {
    // TODO
  });
  xit("should create vouchers not available for selected channel", () => {
    // TODO
  });
});
