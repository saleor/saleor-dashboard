/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { createCustomer } from "../../../support/api/requests/Customer";
import { createReadyToFulfillOrder } from "../../../support/api/utils/ordersUtils";
import { createProductWithShipping } from "../../../support/api/utils/products/productsUtils";

const name = `ProductsWithoutSkuInOrder${faker.datatype.number()}`;

describe("As an admin I should be able to create order with variant without SKU", () => {
  it(
    "should create order with variant product without sku. SALEOR_2801",
    { tags: ["@products", "@allEnv", "@stable"] },
    () => {
      let variants;
      let channel;
      let shippingMethodId;
      let address;

      cy.clearSessionData().loginUserViaRequest();
      createProductWithShipping({ name, sku: null })
        .then(
          ({
            variantsList,
            defaultChannel,
            shippingMethod,
            address: addressResp,
          }) => {
            variants = variantsList;
            channel = defaultChannel;
            shippingMethodId = shippingMethod.id;
            address = addressResp;
            createCustomer(`${name}@example.com`, name, address, true);
          },
        )
        .then(customerResp => {
          const customer = customerResp.user;
          createReadyToFulfillOrder({
            address,
            channelId: channel.id,
            customerId: customer.id,
            shippingMethodId,
            variantsList: variants,
          });
        })
        .then(({ errors }) => {
          expect(errors, "check if no errors").to.be.empty;
        });
    },
  );
});
