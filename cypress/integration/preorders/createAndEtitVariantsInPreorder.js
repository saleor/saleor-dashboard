/// <reference types="cypress"/>
/// <reference types="../../support"/>

import { PRODUCT_DETAILS } from "../../elements/catalog/products/product-details";
import { VARIANTS_SELECTORS } from "../../elements/catalog/products/variants-selectors";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { productDetailsUrl } from "../../fixtures/urlList";
import { getVariant } from "../../support/api/requests/Product";
import { createWaitingForCaptureOrder } from "../../support/api/utils/ordersUtils";
import { createProductWithShipping } from "../../support/api/utils/products/productsUtils";
import filterTests from "../../support/filterTests";
import { formatDate, formatTime } from "../../support/formatData/formatDate";
import {
  fillUpVariantAttributeAndSku,
  selectChannelForVariantAndFillUpPrices
} from "../../support/pages/catalog/products/VariantsPage";

filterTests({ definedTags: ["all"], version: "3.1.0" }, () => {
  describe("Creating variants", () => {
    const startsWith = "CreatePreOrder";
    const attributeValues = ["value1", "value2", "value3"];
    const futureDate = new Date().setDate(new Date().getDate() + 14);
    const endDate = formatDate(futureDate);
    const endTime = formatTime(futureDate);

    let defaultChannel;
    let product;
    let address;
    let shippingMethod;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      createProductWithShipping({ name: startsWith, attributeValues }).then(
        resp => {
          defaultChannel = resp.defaultChannel;
          product = resp.product;
          address = resp.address;
          shippingMethod = resp.shippingMethod;
        }
      );
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
    });

    it("should create variant in preorder", () => {
      const threshold = 100;
      let variant;

      cy.visit(productDetailsUrl(product.id))
        .get(PRODUCT_DETAILS.addVariantsButton)
        .click();
      fillUpVariantAttributeAndSku({
        attributeName: attributeValues[1],
        sku: attributeValues[1]
      });
      cy.get(VARIANTS_SELECTORS.preorderCheckbox)
        .click()
        .get(VARIANTS_SELECTORS.setUpEndDateButton)
        .click()
        .get(VARIANTS_SELECTORS.preorderEndDateInput)
        .type(endDate)
        .get(VARIANTS_SELECTORS.preorderEndTimeInput)
        .type(endTime)
        .get(VARIANTS_SELECTORS.globalThresholdInput)
        .type(threshold)
        .addAliasToGraphRequest("VariantCreate")
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .waitForRequestAndCheckIfNoErrors("@VariantCreate")
        .then(({ response }) => {
          variant = response.body.data.productVariantCreate.productVariant;
          expect(variant.id).to.be.ok;
          cy.get(BUTTON_SELECTORS.back).click();
          selectChannelForVariantAndFillUpPrices({
            channelName: defaultChannel.name,
            attributeName: attributeValues[1],
            price: 10
          });
        })
        .then(() => {
          createWaitingForCaptureOrder({
            address,
            channelSlug: defaultChannel.slug,
            email: "example@example.com",
            shippingMethodId: shippingMethod.id,
            variantsList: [variant]
          });
        })
        .then(({ order }) => {
          expect(order.id).to.be.ok;
          getVariant(variant.id, defaultChannel.slug);
        })
        .then(({ preorder }) => {
          const respEndDate = new Date(preorder.endDate);

          expect(preorder.globalThreshold).to.eq(threshold);
          expect(preorder.globalSoldUnits).to.eq(1);
          expect(endDate).to.eq(formatDate(respEndDate));
          expect(endTime).to.eq(formatTime(respEndDate));
        });
    });
  });
});
