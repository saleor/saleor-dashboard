/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import {
  createCustomer,
  deleteCustomersStartsWith
} from "../../../support/api/requests/Customer";
import { createReadyToFulfillOrder } from "../../../support/api/utils/ordersUtils";
import {
  createProductWithShipping,
  deleteProductsStartsWith
} from "../../../support/api/utils/products/productsUtils";
import { deleteShippingStartsWith } from "../../../support/api/utils/shippingUtils";
import filterTests from "../../../support/filterTests";

filterTests({ definedTags: ["all", "critical"] }, () => {
  const name = "ProductsWithoutSkuInOrder";

  describe("Add productWithout SKU to order", () => {
    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteProductsStartsWith(name);
      deleteShippingStartsWith(name);
      deleteCustomersStartsWith(name);
    });

    it("should create order with variant product without sku", () => {
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
            address: addressResp
          }) => {
            variants = variantsList;
            channel = defaultChannel;
            shippingMethodId = shippingMethod.id;
            address = addressResp;
            createCustomer(`${name}@example.com`, name, address, true);
          }
        )
        .then(customerResp => {
          const customer = customerResp.user;
          createReadyToFulfillOrder({
            address,
            channelId: channel.id,
            customerId: customer.id,
            shippingMethodId,
            variantsList: variants
          });
        })
        .then(({ errors }) => {
          expect(errors, "check if no errors").to.be.empty;
        });
    });
  });
});
