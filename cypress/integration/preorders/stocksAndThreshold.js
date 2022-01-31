/// <reference types="cypress"/>
/// <reference types="../../support"/>

import { VARIANTS_SELECTORS } from "../../elements/catalog/products/variants-selectors";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { variantDetailsUrl } from "../../fixtures/urlList";
import { createCheckout } from "../../support/api/requests/Checkout";
import { fulfillOrder } from "../../support/api/requests/Order";
import { getVariant } from "../../support/api/requests/Product";
import { deleteCollectionsStartsWith } from "../../support/api/utils/catalog/collectionsUtils";
import { createWaitingForCaptureOrder } from "../../support/api/utils/ordersUtils";
import {
  createProductWithShipping,
  deleteProductsStartsWith
} from "../../support/api/utils/products/productsUtils";
import filterTests from "../../support/filterTests";
import { saveVariant } from "../../support/pages/catalog/products/VariantsPage";

filterTests({ definedTags: ["all"], version: "3.1.0" }, () => {
  describe("Stocks and threshold in preorder variants", () => {
    const startsWith = "StocksThreshold";
    const attributeValues = ["value1", "value2"];
    const preorder = {
      globalThreshold: 15
    };

    let defaultChannel;
    let product;
    let variantsList;
    let warehouse;
    let checkoutData;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteProductsStartsWith(startsWith);
      deleteCollectionsStartsWith(startsWith);
      createProductWithShipping({
        name: startsWith,
        attributeValues,
        preorder
      }).then(resp => {
        checkoutData = {
          address: resp.address,
          channelSlug: resp.defaultChannel.slug,
          email: "example@example.com",
          shippingMethodName: resp.shippingMethod.name,
          variantsList: resp.variantsList
        };
        warehouse = resp.warehouse;
        defaultChannel = resp.defaultChannel;
        product = resp.product;
        variantsList = resp.variantsList;
      });
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
    });

    it("should not be able to order more products then channel threshold", () => {
      cy.visit(variantDetailsUrl(product.id, variantsList[0].id))
        .get(VARIANTS_SELECTORS.channelThresholdInput)
        .type(5)
        .addAliasToGraphRequest("ProductVariantChannelListingUpdate");
      saveVariant("VariantUpdate");
      cy.wait("@ProductVariantChannelListingUpdate");
      checkoutData.productQuantity = 7;
      createCheckout(checkoutData).then(({ errors }) => {
        expect(errors[0].field).to.eq("quantity");
      });
    });

    it("should not be able to order more products then threshold even if channel is not exceeded", () => {
      cy.visit(variantDetailsUrl(product.id, variantsList[0].id))
        .get(VARIANTS_SELECTORS.channelThresholdInput)
        .type(40);
      saveVariant("VariantUpdate");
      checkoutData.productQuantity = 20;
      createCheckout(checkoutData).then(({ errors }) => {
        expect(errors[0].field).to.eq("quantity");
      });
    });

    it("should allocate variants bought in preorder to correct warehouses", () => {
      let order;
      createWaitingForCaptureOrder(checkoutData)
        .then(({ order: orderResp }) => {
          order = orderResp;
          cy.visit(variantDetailsUrl(product.id, variantsList[0].id))
            .get(VARIANTS_SELECTORS.preorderCheckbox)
            .click()
            .addAliasToGraphRequest("ProductVariantPreorderDeactivate")
            .get(BUTTON_SELECTORS.submit)
            .click()
            .waitForRequestAndCheckIfNoErrors(
              "@ProductVariantPreorderDeactivate"
            );
          getVariant(variantsList[0].id, defaultChannel.slug);
        })
        .then(variantResp => {
          expect(
            variantResp.stocks[0].quantityAllocated,
            "product is allocated with correct quantity"
          ).to.eq(1);
          expect(
            variantResp.stocks[0].warehouse.id,
            "product is allocated to correct warehouse"
          ).to.eq(warehouse.id);
        })
        .then(() => {
          fulfillOrder({
            orderId: order.id,
            warehouse: warehouse.id,
            quantity: 1,
            linesId: order.lines
          });
        })
        .then(({ errors }) => {
          expect(errors, "no errors when fulfilling order").to.be.empty;
        });
    });
  });
});
