import faker from "faker";

import ProductDetails from "../../../apiRequests/storeFront/ProductDetails";
import ProductSteps from "../../../steps/products/productSteps";
import { productDetailsUrl } from "../../../url/urlList";
import ChannelsUtils from "../../../utils/channelsUtils";
import ProductsUtils from "../../../utils/productsUtils";
import ShippingUtils from "../../../utils/shippingUtils";
import { isProductAvailableForPurchase } from "../../../utils/storeFront/storeFrontProductUtils";

// <reference types="cypress" />
describe("Products available in listings", () => {
  const productDetails = new ProductDetails();
  const shippingUtils = new ShippingUtils();
  const channelsUtils = new ChannelsUtils();
  const productsUtils = new ProductsUtils();
  const productSteps = new ProductSteps();
  const startsWith = "Cy-";
  const name = `${startsWith}${faker.random.number()}`;
  let productType;
  let attribute;
  let category;
  let defaultChannel;
  let warehouse;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    shippingUtils.deleteShipping(startsWith);
    productsUtils.deleteProperProducts(startsWith);

    channelsUtils
      .getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        cy.fixture("addresses");
      })
      .then(addressesFixture => {
        shippingUtils.createShipping({
          channelId: defaultChannel.id,
          name,
          address: addressesFixture.plAddress
        });
      })
      .then(() => {
        warehouse = shippingUtils.getWarehouse();
      });

    productsUtils.createTypeAttributeAndCategoryForProduct(name).then(() => {
      productType = productsUtils.getProductType();
      attribute = productsUtils.getAttribute();
      category = productsUtils.getCategory();
    });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should update product to available for purchase", () => {
    const productName = `${startsWith}${faker.random.number()}`;
    productsUtils
      .createProductInChannel({
        name: productName,
        channelId: defaultChannel.id,
        warehouseId: warehouse.id,
        productTypeId: productType.id,
        attributeId: attribute.id,
        categoryId: category.id,
        isAvailableForPurchase: false
      })
      .then(() => {
        const productUrl = productDetailsUrl(
          productsUtils.getCreatedProduct().id
        );
        productSteps.updateProductIsAvailableForPurchase(productUrl, true);
      })
      .then(() => {
        productDetails.getProductDetails(
          productsUtils.getCreatedProduct().id,
          defaultChannel.slug
        );
      })
      .then(resp => {
        expect(isProductAvailableForPurchase(resp)).to.be.eq(true);
      });
  });
  it("should update product to not available for purchase", () => {
    const productName = `${startsWith}${faker.random.number()}`;
    productsUtils
      .createProductInChannel({
        name: productName,
        channelId: defaultChannel.id,
        warehouseId: warehouse.id,
        productTypeId: productType.id,
        attributeId: attribute.id,
        categoryId: category.id
      })
      .then(() => {
        const productUrl = productDetailsUrl(
          productsUtils.getCreatedProduct().id
        );
        productSteps.updateProductIsAvailableForPurchase(productUrl, false);
      })
      .then(() => {
        productDetails.getProductDetails(
          productsUtils.getCreatedProduct().id,
          defaultChannel.slug
        );
      })
      .then(resp => {
        expect(isProductAvailableForPurchase(resp)).to.be.eq(false);
      });
  });
});
