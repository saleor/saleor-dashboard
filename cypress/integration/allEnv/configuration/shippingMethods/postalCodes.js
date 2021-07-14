// <reference types="cypress" />
import faker from "faker";

import { createCheckout } from "../../../../apiRequests/Checkout";
import { createShippingZone } from "../../../../apiRequests/ShippingMethod";
import { createWarehouse } from "../../../../apiRequests/Warehouse";
import { ONE_PERMISSION_USERS } from "../../../../Data/users";
import {
  createRateWithPostalCode,
  postalCodesOptions
} from "../../../../steps/shippingMethodSteps";
import { shippingZoneDetailsUrl } from "../../../../url/urlList";
import { getDefaultChannel } from "../../../../utils/channelsUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith
} from "../../../../utils/products/productsUtils";
import { deleteShippingStartsWith } from "../../../../utils/shippingUtils";
import { isShippingAvailableInCheckout } from "../../../../utils/storeFront/checkoutUtils";

describe("Postal codes in shipping", () => {
  const startsWith = "CyShippingMethods-";
  const name = `${startsWith}${faker.datatype.number()}`;

  const price = 10;

  let defaultChannel;
  let usAddress;
  let secondUsAddress;
  let shippingZone;
  let warehouse;
  let variantsList;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteShippingStartsWith(startsWith);
    deleteProductsStartsWith(startsWith);

    getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        cy.fixture("addresses");
      })
      .then(
        ({
          usAddress: usAddressResp,
          secondUsAddress: secondUsAddressResp
        }) => {
          usAddress = usAddressResp;
          secondUsAddress = secondUsAddressResp;
          createShippingZone(name, "US", defaultChannel.id);
        }
      )
      .then(shippingZoneResp => {
        shippingZone = shippingZoneResp;
        createWarehouse({
          name,
          shippingZone: shippingZone.id,
          address: usAddress
        });
      })
      .then(warehouseResp => {
        warehouse = warehouseResp;
        createTypeAttributeAndCategoryForProduct(name);
      })
      .then(({ attribute, productType, category }) => {
        createProductInChannel({
          name,
          channelId: defaultChannel.id,
          warehouseId: warehouse.id,
          attributeId: attribute.id,
          categoryId: category.id,
          productTypeId: productType.id
        });
      })
      .then(({ variantsList: variantsListResp }) => {
        variantsList = variantsListResp;
      });
  });

  beforeEach(() => {
    cy.clearSessionData()
      .loginUserViaRequest("auth", ONE_PERMISSION_USERS.shipping)
      .visit(shippingZoneDetailsUrl(shippingZone.id));
  });

  it("Create shipping method with included postal codes", () => {
    const rateName = `${startsWith}${faker.datatype.number()}`;

    createRateWithPostalCode({
      rateName,
      price,
      postalCodeOption: postalCodesOptions.INCLUDE_OPTION,
      maxPostalCode: usAddress.postalCode,
      minPostalCode: usAddress.postalCode
    });
    isShippingAvailableForAddress(usAddress, rateName).then(
      isAvailable => expect(isAvailable).to.be.true
    );
    isShippingAvailableForAddress(secondUsAddress, rateName).then(
      isAvailable => expect(isAvailable).to.be.false
    );
  });

  it("Create shipping method with excluded postal codes", () => {
    const rateName = `${startsWith}${faker.datatype.number()}`;

    createRateWithPostalCode({
      rateName,
      price,
      postalCodeOption: postalCodesOptions.EXCLUDE_OPTION,
      maxPostalCode: usAddress.postalCode,
      minPostalCode: usAddress.postalCode
    });
    isShippingAvailableForAddress(usAddress, rateName).then(
      isAvailable => expect(isAvailable).to.be.false
    );
    isShippingAvailableForAddress(secondUsAddress, rateName).then(
      isAvailable => expect(isAvailable).to.be.true
    );
  });

  function isShippingAvailableForAddress(address, rateName) {
    return createCheckout({
      address,
      channelSlug: defaultChannel.slug,
      email: "example@example.com",
      variantsList
    }).then(({ checkout }) =>
      isShippingAvailableInCheckout(checkout, rateName)
    );
  }
});
