// <reference types="cypress" />

import faker from "faker";

import { createChannel } from "../../../apiRequests/Channels";
import {
  addProductsToCheckout,
  addShippingMethod,
  createCheckout
} from "../../../apiRequests/Checkout";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith
} from "../../../utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../../utils/shippingUtils";

describe("Products without shipment option", () => {
  const startsWith = "WithoutShipmentCheckout-";
  const name = `${startsWith}${faker.datatype.number()}`;
  const nameProdWithoutShipping = `${startsWith}${faker.datatype.number()}`;

  let channel;
  let address;
  let warehouse;
  let shippingMethod;
  let productWithShipping;
  let productWithoutShipping;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();

    deleteProductsStartsWith(startsWith);
    deleteShippingStartsWith(startsWith);

    createChannel({
      name
    })
      .then(channelResp => {
        channel = channelResp;
        cy.fixture("addresses");
      })
      .then(({ usAddress }) => {
        address = usAddress;
        createShipping({
          channelId: channel.id,
          name,
          address,
          minProductPrice: 100
        });
      })
      .then(
        ({ warehouse: warehouseResp, shippingMethod: shippingMethodResp }) => {
          warehouse = warehouseResp;
          shippingMethod = shippingMethodResp;
          createTypeAttributeAndCategoryForProduct(name);
        }
      )
      .then(
        ({
          attribute: attributeResp,
          productType: productTypeResp,
          category: categoryResp
        }) => {
          createProductInChannel({
            attributeId: attributeResp.id,
            categoryId: categoryResp.id,
            channelId: channel.id,
            name,
            productTypeId: productTypeResp.id,
            warehouseId: warehouse.id
          }).then(({ variantsList }) => (productWithShipping = variantsList));
          createProductInChannel({
            attributeId: attributeResp.id,
            categoryId: categoryResp.id,
            channelId: channel.id,
            name: nameProdWithoutShipping,
            productTypeId: productTypeResp.id,
            warehouseId: warehouse.id
          }).then(
            ({ variantsList }) => (productWithoutShipping = variantsList)
          );
        }
      );
  });

  it("should be not possible to buy product without shipping option", () => {
    createCheckout({
      channelSlug: channel.slug,
      email: "example@example.com",
      variantsList: productWithoutShipping,
      address,
      auth: "token"
    })
      .then(({ checkout }) => {
        expect(
          checkout.availableShippingMethods,
          "expect no available shipping"
        ).to.have.length(0);
        addProductsToCheckout(checkout.id, productWithShipping, 1);
      })
      .then(({ checkout }) => {
        expect(
          checkout.availableShippingMethods,
          "expect no available shipping"
        ).to.have.length(0);
        addShippingMethod(checkout.id, shippingMethod.id);
      })
      .then(({ errors }) => {
        expect(errors[0].field, "expect error in shipping method").to.be.eq(
          "shippingMethod"
        );
      });
  });
});
