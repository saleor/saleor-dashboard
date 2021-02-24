// <reference types="cypress" />

import faker from "faker";
import moment from "moment-timezone";

import { MENAGE_CHANNEL_AVAILABILITY } from "../../elements/channels/menage-channel-availability";
import { SALES_SELECTORS } from "../../elements/discounts/sales";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { urlList } from "../../url/urlList";
import ChannelsUtils from "../../utils/channelsUtils";
import ProductsUtils from "../../utils/productsUtils";
import ShippingUtils from "../../utils/shippingUtils";

describe("Sales discounts", () => {
  const startsWith = "Cy-";

  const productsUtils = new ProductsUtils();
  const channelsUtils = new ChannelsUtils();
  const shippingUtils = new ShippingUtils();

  let productType;
  let attribute;
  let category;
  let defaultChannel;
  let warehouse;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    /*
        deleteSales
        delete products
        getDefaultChannel
        */
    const name = `${startsWith}${faker.random.number()}`;
    productsUtils
      .createTypeAttributeAndCategoryForProduct(name)
      .then(() => {
        productType = productsUtils.getProductType();
        attribute = productsUtils.getAttribute();
        category = productsUtils.getCategory();

        channelsUtils.getDefaultChannel();
      })
      .then(channel => {
        defaultChannel = channel;
        cy.fixture("addresses");
      })
      .then(addresses => {
        shippingUtils.createShipping({
          channelId: defaultChannel.id,
          name,
          address: addresses.plAddress,
          price: 100
        });
      })
      .then(() => {
        warehouse = shippingUtils.getWarehouse();
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should create percentage discount", () => {
    const saleName = `${startsWith}${faker.random.number()}`;
    const discountValue = 50;

    productsUtils.createProductInChannel({
      name: saleName,
      channel: defaultChannel.id,
      warehouseId: warehouse.id,
      productTypeId: productType.id,
      attributeId: attribute.id,
      categoryId: category.id,
      price: 100
    });
    cy.visit(urlList.sales);
    cy.get(SALES_SELECTORS.createSaleButton)
      .click()
      .get(SALES_SELECTORS.nameInput)
      .type(saleName)
      .get(SALES_SELECTORS.percentageOption)
      .click()
      .get(MENAGE_CHANNEL_AVAILABILITY.availableManageButton)
      .click()
      .get(MENAGE_CHANNEL_AVAILABILITY.allChannelsInput)
      .click()
      .get(MENAGE_CHANNEL_AVAILABILITY.channelsAvailabilityForm)
      .contains(defaultChannel.name)
      .click()
      .get(BUTTON_SELECTORS.submit)
      .click()
      .get(SALES_SELECTORS.discountValue)
      .type(discountValue)
      .get(SALES_SELECTORS.startDateInput)
      .type(moment().format("YYYY-MM-DD"))
      .get(SALES_SELECTORS.saveButton)
      .click();
    /*
        assign product to sale
        check price on storeFront
        */
  });

  xit("should create fixed price discount", () => {
    /*
        create new sale - fixed price
        create product
        assign product to sale
        check price on storeFront
        */
  });

  xit("should create not available for channel discount", () => {
    /*
        create new channel
        create new sale - in new channel
        create product
        assign product to sale
        check price on storeFront - in default channel
        */
  });
});
