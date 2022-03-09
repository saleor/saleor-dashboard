/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import { createCustomer } from "../../../support/api/requests/Customer";
import { createReadyToFulfillOrder } from "../../../support/api/utils/ordersUtils";
import { createProductWithShipping } from "../../../support/api/utils/products/productsUtils";
import filterTests from "../../../support/filterTests";

filterTests({ definedTags: ["all", "critical", "refactored"] }, () => {
  const name = "ProductsWithoutSkuInOrder";

  describe("Add productWithout SKU to order", () => {
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
