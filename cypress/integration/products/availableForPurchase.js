import faker from "faker";

import { PRODUCTS_SELECTORS } from "../../elements/catalog/product-selectors";
import { URL_LIST } from "../../url/url-list";
import ChannelsUtils from "../../utils/channelsUtils";
import ProductsUtils from "../../utils/productsUtils";
import ShippingUtils from "../../utils/shippingUtils";

// <reference types="cypress" />
describe("Products", () => {
  const shippingUtils = new ShippingUtils();
  const channelsUtils = new ChannelsUtils();
  const productsUtils = new ProductsUtils();

  const startsWith = "Cy-";
  const name = `${startsWith}${faker.random.number()}`;
  let productTypeId;
  let attributeId;
  let categoryId;
  let defaultChannel;
  let warehouseId;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    shippingUtils.deleteShipping(startsWith);
    productsUtils.deleteProducts(startsWith);

    channelsUtils.getDefaultChannel().then(channel => {
      defaultChannel = channel;
      cy.fixture("addresses").then(json => {
        shippingUtils
          .createShipping(defaultChannel, name, json.plAddress, 10)
          .then(() => {
            warehouseId = shippingUtils.getWarehouseId();
          });
      });
    });
    productsUtils.createTypeAttributeAndCategoryForProduct(name).then(() => {
      productTypeId = productsUtils.getProductTypeId();
      attributeId = productsUtils.getAttributeId();
      categoryId = productsUtils.getCategoryId();
    });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should be possible to add to cart available for purchase product", () => {
    const productName = `${startsWith}${faker.random.number()}`;
    productsUtils
      .createProductInChannel(
        productName,
        productTypeId,
        attributeId,
        categoryId,
        defaultChannel.id,
        true,
        false,
        true,
        warehouseId,
        10,
        10
      )
      .then(() => {
        const productUrl = `${
          URL_LIST.products
        }${productsUtils.getCreatedProductId()}`;
        cy.visit(productUrl)
          .get(PRODUCTS_SELECTORS.assignedChannels)
          .click()
          .get(
            `${PRODUCTS_SELECTORS.availableForPurchaseRadioButtons}${PRODUCTS_SELECTORS.radioButtonsValueTrue}`
          )
          .click()
          .get(PRODUCTS_SELECTORS.saveBtn)
          .click()
          .waitForGraph("ProductChannelListingUpdate")
          .getProductDetails(
            productsUtils.getCreatedProductId(),
            defaultChannel.slug
          )
          .then(productDetailsResp => {
            expect(productDetailsResp.body[0].data.product.name).to.equal(
              productName
            );
            expect(
              productDetailsResp.body[0].data.product.isAvailableForPurchase
            ).to.be.eq(true);
          });
      });
  });
  xit("shouldn't be possible to add to cart not available for purchase product", () => {
    const productName = `${startsWith}${faker.random.number()}`;
    productsUtils
      .createProductInChannel(
        productName,
        productTypeId,
        attributeId,
        categoryId,
        defaultChannel.id,
        true,
        true,
        true,
        warehouseId,
        10,
        10
      )
      .then(() => {
        const productUrl = `${
          URL_LIST.products
        }${productsUtils.getCreatedProductId()}`;
        cy.visit(productUrl)
          .get(PRODUCTS_SELECTORS.assignedChannels)
          .click()
          .get(
            `${PRODUCTS_SELECTORS.availableForPurchaseRadioButtons}${PRODUCTS_SELECTORS.radioButtonsValueFalse}`
          )
          .click()
          .get(PRODUCTS_SELECTORS.saveBtn)
          .click()
          .waitForGraph("ProductChannelListingUpdate")
          .get("@shopUrl")
          .getProductDetails(
            productsUtils.getCreatedProductId(),
            defaultChannel.slug
          )
          .then(productDetailsResp => {
            expect(productDetailsResp.body[0].data.product.name).to.equal(
              productName
            );
            expect(
              productDetailsResp.body[0].data.product.isAvailableForPurchase
            ).to.be.eq(false);
          });
      });
  });
});
