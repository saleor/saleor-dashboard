/// <reference types="cypress"/>
/// <reference types="../../../../support"/>

import faker from "faker";

import { shippingZoneDetailsUrl } from "../../../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../../../fixtures/users";
import { createCheckout } from "../../../../support/api/requests/Checkout";
import { createShippingZone } from "../../../../support/api/requests/ShippingMethod";
import { createWarehouse } from "../../../../support/api/requests/Warehouse";
import { getDefaultChannel } from "../../../../support/api/utils/channelsUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith
} from "../../../../support/api/utils/products/productsUtils";
import { deleteShippingStartsWith } from "../../../../support/api/utils/shippingUtils";
import { isShippingAvailableInCheckout } from "../../../../support/api/utils/storeFront/checkoutUtils";
import filterTests from "../../../../support/filterTests";
import {
  createShippingRate,
  rateOptions
} from "../../../../support/pages/shippingMethodPage";

filterTests({ definedTags: ["all"] }, () => {
  describe("Shipping weight limits", () => {
    const startsWith = "CyWeightRates-";
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
          createShippingZone(name, "US", defaultChannel.id);
        })
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
            productTypeId: productType.id,
            weight: 10
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

    it("should be possible to buy product in a shipping weight limits", () => {
      const rateName = `${startsWith}${faker.datatype.number()}`;

      createShippingRate({
        rateName,
        price,
        rateOption: rateOptions.WEIGHT_OPTION,
        weightLimits: {
          max: 11,
          min: 10
        }
      })
        .then(() => {
          createCheckout({
            address: usAddress,
            channelSlug: defaultChannel.slug,
            email: "example@example.com",
            variantsList
          });
        })
        .then(({ checkout }) => {
          expect(isShippingAvailableInCheckout(checkout, rateName)).to.be.true;
        });
    });

    it("should not be possible to buy product not in a shipping weight limits", () => {
      const rateName = `${startsWith}${faker.datatype.number()}`;

      createShippingRate({
        rateName,
        price,
        rateOption: rateOptions.WEIGHT_OPTION,
        weightLimits: {
          max: 101,
          min: 100
        }
      })
        .then(() => {
          createCheckout({
            address: usAddress,
            channelSlug: defaultChannel.slug,
            email: "example@example.com",
            variantsList
          });
        })
        .then(({ checkout }) => {
          expect(isShippingAvailableInCheckout(checkout, rateName)).to.be.false;
        });
    });
  });
});
