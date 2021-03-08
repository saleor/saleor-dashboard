// <reference types="cypress" />
import { addChannelToShippingMethod } from "../../apiRequests/ShippingMethod";
import { shippingDetailsUrl } from "../../url/urlList";
import {
  createChannel,
  getCreatedChannel,
  getDefaultChannel
} from "../../utils/channelsUtils";
import * as productsUtils from "../../utils/productsUtils";
import {
  createShipping,
  getShippingMethod,
  getShippingZone
} from "../../utils/shippingUtils";

describe("Shipping methods", () => {
  const startsWith = "Cy-";
  const name = `${startsWith}${faker.random.number()}`;
  let defaultChannel;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    productsUtils.deleteProperProducts(startsWith);
    getDefaultChannel().then(channel => (defaultChannel = channel));
    productsUtils
      .createTypeAttributeAndCategoryForProduct(startsWith)
      .then(() => {
        productUtils.createProductInChannel({
          name,
          channelId: defaultChannel.id,
          productTypeId: productsUtils.getProductType().id,
          attributeId: productsUtils.getAttribute().id,
          categoryId: productsUtils.getCategory().id
        });
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should display different price for each channel", () => {
    const defaultChannelPrice = 11;
    const createdChannelPrice = 7;
    let shippingMethod;
    let shippingZone;
    let createdChannel;
    createChannel(name)
      .then(() => {
        createChannel = getCreatedChannel;
        cy.fixture("addresses");
      })
      .then(addresses => {
        createShipping({
          channelId: defaultChannel.id,
          name,
          address: addresses.plAddress,
          price: defaultChannelPrice
        });
      })
      .then(() => {
        shippingZone = getShippingZone().id;
        shippingMethod = getShippingMethod().id;
        addChannelToShippingMethod(
          shippingMethod.id,
          createdChannel.id,
          createdChannelPrice
        );
      })
      .then(() => {
        cy.visit(shippingDetailsUrl(shippingZone.id));
      });
    /*
        create channel
        create shipping method - with prices/ currency per channel
        open shipping method
        check prices in rates
        change channel
        check prices for changed channel
        */
  });
  it("should be possible to create price based shipping method", () => {
    /*
        create shipping method - with price based - in view
        check available shipping methods on storefront
        */
  });

  it("should be possible to weight price based shipping method", () => {
    /*
        create shipping method - weight based - in view
        check available shipping methods on storefront
        */
  });
});
