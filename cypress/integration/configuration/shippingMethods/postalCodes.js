/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { shippingZoneDetailsUrl } from "../../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../../fixtures/users";
import { createCheckout } from "../../../support/api/requests/Checkout";
import { createShippingZone } from "../../../support/api/requests/ShippingMethod";
import { createWarehouse } from "../../../support/api/requests/Warehouse";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith
} from "../../../support/api/utils/products/productsUtils";
import { deleteShippingStartsWith } from "../../../support/api/utils/shippingUtils";
import { isShippingAvailableInCheckout } from "../../../support/api/utils/storeFront/checkoutUtils";
import filterTests from "../../../support/filterTests";
import {
  createRateWithPostalCode,
  postalCodesOptions
} from "../../../support/pages/shippingMethodPage";

filterTests({ definedTags: ["all"] }, () => {
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
          createTypeAttributeAndCategoryForProduct({ name });
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
});
