import faker from "faker";

import ProductSteps from "../../steps/productSteps";
import { urlList } from "../../url/urlList";
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
        shippingUtils.createShipping(
          defaultChannel,
          name,
          addressesFixture.plAddress,
          10
        );
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
      .createProductInChannel(
        productName,
        defaultChannel.id,
        warehouse.id,
        10,
        productType.id,
        attribute.id,
        category.id,
        1,
        true,
        false,
        true
      )
      .then(() => {
        const productUrl = `${urlList.products}${
          productsUtils.getCreatedProduct().id
        }`;
        productSteps.updateProductIsAvailableForPurchase(productUrl, true);
      })
      .then(() => {
        frontShopProductUtils.isProductAvailableForPurchase(
          productsUtils.getCreatedProduct().id,
          defaultChannel.slug,
          productName
        );
      })
      .then(isProductVisible => {
        expect(isProductVisible).to.be.eq(true);
      });
  });
  it("should update product to not available for purchase", () => {
    const productName = `${startsWith}${faker.random.number()}`;
    productsUtils
      .createProductInChannel(
        productName,
        defaultChannel.id,
        warehouse.id,
        10,
        productType.id,
        attribute.id,
        category.id,
        1,
        true,
        true,
        true
      )
      .then(() => {
        const productUrl = `${urlList.products}${
          productsUtils.getCreatedProduct().id
        }`;
        productSteps.updateProductIsAvailableForPurchase(productUrl, false);
        frontShopProductUtils
          .isProductAvailableForPurchase(
            productsUtils.getCreatedProduct().id,
            defaultChannel.slug,
            productName
          )
          .then(isProductVisible => {
            expect(isProductVisible).to.be.eq(false);
          });
      });
  });
});
