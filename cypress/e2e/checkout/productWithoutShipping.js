/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { createChannel } from "../../support/api/requests/Channels";
import {
  addProductsToCheckout,
  addShippingMethod,
  createCheckout,
} from "../../support/api/requests/Checkout";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
} from "../../support/api/utils/products/productsUtils";
import { createShipping } from "../../support/api/utils/shippingUtils";

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
    cy.loginUserViaRequest();

    createChannel({
      name,
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
          minProductPrice: 100,
        });
      })
      .then(
        ({ warehouse: warehouseResp, shippingMethod: shippingMethodResp }) => {
          warehouse = warehouseResp;
          shippingMethod = shippingMethodResp;
          createTypeAttributeAndCategoryForProduct({ name });
        },
      )
      .then(
        ({
          attribute: attributeResp,
          productType: productTypeResp,
          category: categoryResp,
        }) => {
          createProductInChannel({
            attributeId: attributeResp.id,
            categoryId: categoryResp.id,
            channelId: channel.id,
            name,
            productTypeId: productTypeResp.id,
            warehouseId: warehouse.id,
          }).then(({ variantsList }) => (productWithShipping = variantsList));
          createProductInChannel({
            attributeId: attributeResp.id,
            categoryId: categoryResp.id,
            channelId: channel.id,
            name: nameProdWithoutShipping,
            productTypeId: productTypeResp.id,
            warehouseId: warehouse.id,
          }).then(({ variantsList }) => {
            productWithoutShipping = variantsList;
            cy.checkIfDataAreNotNull({
              channel,
              address,
              warehouse,
              shippingMethod,
              productWithShipping,
              productWithoutShipping,
            });
          });
        },
      );
  });

  it(
    "should be not possible to buy product without shipping option",
    { tags: ["@checkout", "@allEnv", "@stable"] },
    () => {
      createCheckout({
        channelSlug: channel.slug,
        email: "example@example.com",
        variantsList: productWithoutShipping,
        address,
        auth: "token",
      })
        .then(({ checkout }) => {
          expect(
            checkout.shippingMethods,
            "expect no available shipping",
          ).to.have.length(0);
          addProductsToCheckout(checkout.id, productWithShipping, 1);
        })
        .then(({ checkout }) => {
          expect(
            checkout.shippingMethods,
            "expect no available shipping",
          ).to.have.length(0);
          addShippingMethod(checkout.id, shippingMethod.id);
        })
        .then(({ errors }) => {
          expect(errors[0].field, "expect error in shipping method").to.be.eq(
            "shippingMethodId",
          );
        });
    },
  );
});
