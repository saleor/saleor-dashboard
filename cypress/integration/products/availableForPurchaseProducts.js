import faker from "faker";

import ProductSteps from "../../steps/productSteps";
import { URL_LIST } from "../../url/url-list";
import ChannelsUtils from "../../utils/channelsUtils";
import FrontShopProductUtils from "../../utils/frontShop/frontShopProductUtils";
import ProductsUtils from "../../utils/productsUtils";
import ShippingUtils from "../../utils/shippingUtils";

// <reference types="cypress" />
describe("Products available in listings", () => {
  const shippingUtils = new ShippingUtils();
  const channelsUtils = new ChannelsUtils();
  const productsUtils = new ProductsUtils();
  const productSteps = new ProductSteps();
  const frontShopProductUtils = new FrontShopProductUtils();
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

  it("should update product to available for purchase", () => {
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
        productSteps.updateProductIsAvailableForPurchase(productUrl, true);
        frontShopProductUtils
          .isProductAvailableForPurchase(
            productsUtils.getCreatedProductId(),
            defaultChannel.slug,
            productName
          )
          .then(isProductVisible => {
            expect(isProductVisible).to.be.eq(true);
          });
      });
  });
  it("should update product to not available for purchase", () => {
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
        productSteps.updateProductIsAvailableForPurchase(productUrl, false);
        frontShopProductUtils
          .isProductAvailableForPurchase(
            productsUtils.getCreatedProductId(),
            defaultChannel.slug,
            productName
          )
          .then(isProductVisible => {
            expect(isProductVisible).to.be.eq(false);
          });
      });
  });
});
