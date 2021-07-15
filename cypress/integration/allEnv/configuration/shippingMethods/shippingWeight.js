// <reference types="cypress" />
import faker from "faker";

import { createCheckout } from "../../../../apiRequests/Checkout";
import {
  createShippingRate as createShippingRateViaApi,
  createShippingZone
} from "../../../../apiRequests/ShippingMethod";
import { updateShopWeightUnit } from "../../../../apiRequests/shopSettings";
import { createWarehouse } from "../../../../apiRequests/Warehouse";
import { ONE_PERMISSION_USERS } from "../../../../Data/users";
import { SHARED_ELEMENTS } from "../../../../elements/shared/sharedElements";
import { SHIPPING_RATE_DETAILS } from "../../../../elements/shipping/shipping-rate-details";
import {
  changeWeightUnit,
  createShippingRate,
  rateOptions
} from "../../../../steps/shippingMethodSteps";
import {
  shippingZoneDetailsUrl,
  urlList,
  weightRateUrl
} from "../../../../url/urlList";
import { getDefaultChannel } from "../../../../utils/channelsUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith
} from "../../../../utils/products/productsUtils";
import { deleteShippingStartsWith } from "../../../../utils/shippingUtils";
import { isShippingAvailableInCheckout } from "../../../../utils/storeFront/checkoutUtils";

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

    updateShopWeightUnit("KG");
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
        createTypeAttributeAndCategoryForProduct(name);
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
    });
    createCheckout({
      address: usAddress,
      channelSlug: defaultChannel.slug,
      email: "example@example.com",
      variantsList
    }).then(({ checkout }) => {
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
    });
    createCheckout({
      address: usAddress,
      channelSlug: defaultChannel.slug,
      email: "example@example.com",
      variantsList
    }).then(({ checkout }) => {
      expect(isShippingAvailableInCheckout(checkout, rateName)).to.be.false;
    });
  });

  // Log in as user with shipping permissions after resolving SALEOR-3407 bug
  it("should recalculate weight after changing shipping weight unit", () => {
    const rateName = `${startsWith}${faker.datatype.number()}`;
    const minWeightInKg = 1;
    const maxWeightInKg = 10;
    const minWeightInG = minWeightInKg * 1000;
    const maxWeightInG = maxWeightInKg * 1000;
    let shippingMethod;

    cy.clearSessionData().loginUserViaRequest();

    createShippingRateViaApi({
      name: rateName,
      shippingZone: shippingZone.id,
      type: "WEIGHT",
      maxWeight: maxWeightInKg,
      minWeight: minWeightInKg
    })
      .then(({ shippingMethod: shippingMethodResp }) => {
        shippingMethod = shippingMethodResp;
        cy.visit(urlList.shippingMethods)
          .get(SHARED_ELEMENTS.progressBar)
          .should("not.exist");
        changeWeightUnit("G");

        cy.addAliasToGraphRequest("ShippingZone");
        cy.visit(weightRateUrl(shippingZone.id, shippingMethod.id))
          .wait("@ShippingZone")
          .its("response.body");
      })
      .then(responseArray => {
        const shippingMethods = responseArray.find(
          element => element.data.shippingZone
        ).data.shippingZone.shippingMethods;
        const rate = shippingMethods.find(
          element => element.id === shippingMethod.id
        );
        expect(rate.minimumOrderWeight.unit).to.eq("G");
        cy.get(SHARED_ELEMENTS.progressBar)
          .should("not.be.visible")
          .get(SHIPPING_RATE_DETAILS.minWeightInput)
          .invoke("val");
      })
      .then(actualMinWeight => {
        expect(parseInt(actualMinWeight, 10)).to.eq(minWeightInG);
        cy.get(SHIPPING_RATE_DETAILS.maxWeightInput).invoke("val");
      })
      .then(actualMaxWeight => {
        expect(parseInt(actualMaxWeight, 10)).to.eq(maxWeightInG);
      });
  });
});
