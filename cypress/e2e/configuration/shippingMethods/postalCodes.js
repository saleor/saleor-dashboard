/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { shippingZoneDetailsUrl } from "../../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../../fixtures/users";
import { updateChannelWarehouses } from "../../../support/api/requests/Channels";
import { createCheckout } from "../../../support/api/requests/Checkout";
import { createShippingZone } from "../../../support/api/requests/ShippingMethod";
import { createWarehouse } from "../../../support/api/requests/Warehouse";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith,
} from "../../../support/api/utils/products/productsUtils";
import { deleteShippingStartsWith } from "../../../support/api/utils/shippingUtils";
import { isShippingAvailableInCheckout } from "../../../support/api/utils/storeFront/checkoutUtils";
import {
  createRateWithPostalCode,
  postalCodesOptions,
} from "../../../support/pages/shippingMethodPage";

describe("As a user I want to create shipping method with postal codes", () => {
  const startsWith = "postalCodes-";
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
          secondUsAddress: secondUsAddressResp,
        }) => {
          usAddress = usAddressResp;
          secondUsAddress = secondUsAddressResp;

          createWarehouse({ name, address: usAddress }).then(warehouseResp => {
            warehouse = warehouseResp;

            updateChannelWarehouses(defaultChannel.id, warehouse.id);
            createShippingZone(
              name,
              "US",
              defaultChannel.id,
              warehouse.id,
            ).then(shippingZoneResp => {
              shippingZone = shippingZoneResp;

              createTypeAttributeAndCategoryForProduct({ name });
            });
          });
        },
      )
      .then(({ attribute, productType, category }) => {
        createProductInChannel({
          name,
          channelId: defaultChannel.id,
          warehouseId: warehouse.id,
          attributeId: attribute.id,
          categoryId: category.id,
          productTypeId: productType.id,
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

  it(
    "should be able to create shipping method with included postal codes. TC: SALEOR_0801",
    { tags: ["@shipping", "@allEnv", "@stable"] },
    () => {
      const rateName = `${startsWith}${faker.datatype.number()}`;

      createRateWithPostalCode({
        rateName,
        price,
        postalCodeOption: postalCodesOptions.INCLUDE_OPTION,
        maxPostalCode: usAddress.postalCode,
        minPostalCode: usAddress.postalCode,
      });
      isShippingAvailableForAddress(usAddress, rateName).then(
        isAvailable => expect(isAvailable).to.be.true,
      );
      isShippingAvailableForAddress(secondUsAddress, rateName).then(
        isAvailable => expect(isAvailable).to.be.false,
      );
    },
  );

  it(
    "should be able to create shipping method with excluded postal codes. TC: SALEOR_0802",
    { tags: ["@shipping", "@allEnv", "@stable"] },
    () => {
      const rateName = `${startsWith}${faker.datatype.number()}`;

      createRateWithPostalCode({
        rateName,
        price,
        postalCodeOption: postalCodesOptions.EXCLUDE_OPTION,
        maxPostalCode: usAddress.postalCode,
        minPostalCode: usAddress.postalCode,
      });
      isShippingAvailableForAddress(usAddress, rateName).then(
        isAvailable => expect(isAvailable).to.be.false,
      );
      isShippingAvailableForAddress(secondUsAddress, rateName).then(
        isAvailable => expect(isAvailable).to.be.true,
      );
    },
  );

  function isShippingAvailableForAddress(address, rateName) {
    return createCheckout({
      address,
      channelSlug: defaultChannel.slug,
      email: "example@example.com",
      variantsList,
    }).then(({ checkout }) =>
      isShippingAvailableInCheckout(checkout, rateName),
    );
  }
});
