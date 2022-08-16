/// <reference types="cypress"/>
/// <reference types="../../../../support"/>

import faker from "faker";

import { shippingZoneDetailsUrl } from "../../../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../../../fixtures/users";
import { updateChannelWarehouses } from "../../../../support/api/requests/Channels";
import { createCheckout } from "../../../../support/api/requests/Checkout";
import { createShippingZone } from "../../../../support/api/requests/ShippingMethod";
import { createWarehouse } from "../../../../support/api/requests/Warehouse";
import { getDefaultChannel } from "../../../../support/api/utils/channelsUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith,
} from "../../../../support/api/utils/products/productsUtils";
import { deleteShippingStartsWith } from "../../../../support/api/utils/shippingUtils";
import { isShippingAvailableInCheckout } from "../../../../support/api/utils/storeFront/checkoutUtils";
import {
  createShippingRate,
  rateOptions,
} from "../../../../support/pages/shippingMethodPage";

describe("As a staff user I want to manage shipping weights", () => {
  const startsWith = "weightsLimits";
  const name = `${startsWith}${faker.datatype.number()}`;

  const price = 10;

  let defaultChannel;
  let usAddress;
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
      .then(({ usAddress: usAddressResp }) => {
        usAddress = usAddressResp;

        createWarehouse({ name, address: usAddress }).then(warehouseResp => {
          warehouse = warehouseResp;

          updateChannelWarehouses(defaultChannel.id, warehouse.id);
          createShippingZone(name, "US", defaultChannel.id, warehouse.id).then(
            shippingZoneResp => {
              shippingZone = shippingZoneResp;

              createTypeAttributeAndCategoryForProduct({ name });
            },
          );
        });
      })
      .then(({ attribute, productType, category }) => {
        createProductInChannel({
          name,
          channelId: defaultChannel.id,
          warehouseId: warehouse.id,
          attributeId: attribute.id,
          categoryId: category.id,
          productTypeId: productType.id,
          weight: 10,
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
    "should be possible to buy product in a shipping weight limits. TC: SALEOR_0902",
    { tags: ["@shipping", "@allEnv", "@stable"] },
    () => {
      const rateName = `${startsWith}${faker.datatype.number()}`;

      createShippingRate({
        rateName,
        price,
        rateOption: rateOptions.WEIGHT_OPTION,
        weightLimits: {
          max: 11,
          min: 10,
        },
      })
        .then(() => {
          createCheckout({
            address: usAddress,
            channelSlug: defaultChannel.slug,
            email: "example@example.com",
            variantsList,
          });
        })
        .then(({ checkout }) => {
          expect(isShippingAvailableInCheckout(checkout, rateName)).to.be.true;
        });
    },
  );

  it(
    "should not be possible to buy product not in a shipping weight limits. TC: SALEOR_0903",
    { tags: ["@shipping", "@allEnv", "@stable"] },
    () => {
      const rateName = `${startsWith}${faker.datatype.number()}`;

      createShippingRate({
        rateName,
        price,
        rateOption: rateOptions.WEIGHT_OPTION,
        weightLimits: {
          max: 101,
          min: 100,
        },
      })
        .then(() => {
          createCheckout({
            address: usAddress,
            channelSlug: defaultChannel.slug,
            email: "example@example.com",
            variantsList,
          });
        })
        .then(({ checkout }) => {
          expect(isShippingAvailableInCheckout(checkout, rateName)).to.be.false;
        });
    },
  );
});
