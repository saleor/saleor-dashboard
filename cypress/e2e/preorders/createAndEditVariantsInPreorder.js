/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { PRODUCT_DETAILS } from "../../elements/catalog/products/product-details";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { productDetailsUrl, variantDetailsUrl } from "../../fixtures/urlList";
import {
  activatePreorderOnVariant,
  deactivatePreorderOnVariant,
  getVariant,
} from "../../support/api/requests/Product";
import { createWaitingForCaptureOrder } from "../../support/api/utils/ordersUtils";
import { createProductWithShipping } from "../../support/api/utils/products/productsUtils";
import { formatDate, formatTime } from "../../support/formatData/formatDate";
import {
  enablePreorderWithThreshold,
  fillUpVariantAttributeAndSku,
  saveVariant,
  selectChannelForVariantAndFillUpPrices,
  setUpPreorderEndDate,
} from "../../support/pages/catalog/products/VariantsPage";

describe("Creating variants in preorder", () => {
  const name = `CreatePreOrder${faker.datatype.number()}`;
  const attributeValues = ["value1", "value2", "value3"];
  const threshold = 100;
  const futureDate = new Date().setDate(new Date().getDate() + 14);
  const endDate = formatDate(futureDate);
  const endTime = formatTime(futureDate);

  let defaultChannel;
  let product;
  let variantsList;
  let checkoutData;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    createProductWithShipping({ name, attributeValues }).then(resp => {
      checkoutData = {
        address: resp.address,
        channelSlug: resp.defaultChannel.slug,
        email: "example@example.com",
        shippingMethodName: resp.shippingMethod.name,
      };
      defaultChannel = resp.defaultChannel;
      product = resp.product;
      variantsList = resp.variantsList;
    });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  xit(
    "should create variant in preorder",
    { tags: ["@preorders", "@allEnv"] },
    () => {
      let variant;

      cy.visit(productDetailsUrl(product.id))
        .get(PRODUCT_DETAILS.addVariantsButton)
        .click();
      fillUpVariantAttributeAndSku({
        attributeName: attributeValues[1],
        sku: attributeValues[1],
      });
      enablePreorderWithThreshold(threshold);
      setUpPreorderEndDate(endDate, endTime);
      saveVariant()
        .then(({ response }) => {
          variant = response.body.data.productVariantCreate.productVariant;
          cy.get(SHARED_ELEMENTS.progressBar)
            .should("be.visible")
            .waitForProgressBarToNotBeVisible()
            .get(BUTTON_SELECTORS.back)
            .click();
          selectChannelForVariantAndFillUpPrices({
            channelName: defaultChannel.name,
            attributeName: attributeValues[1],
            price: 10,
          });
        })
        .then(() => {
          checkoutData.variantsList = [variant];
          createWaitingForCaptureOrder(checkoutData);
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
    },
  );

  it(
    "should enable preorder on active variant",
    { tags: ["@preorders", "@allEnv"] },
    () => {
      const variant = variantsList[0];
      checkoutData.variantsList = [variant];

      deactivatePreorderOnVariant(variant.id);
      cy.visit(variantDetailsUrl(product.id, variant.id));
      enablePreorderWithThreshold(threshold);
      saveVariant("VariantUpdate");
      createWaitingForCaptureOrder(checkoutData)
        .then(({ order }) => {
          expect(order.id).to.be.ok;
          getVariant(variant.id, defaultChannel.slug);
        })
        .then(({ preorder }) => {
          expect(preorder.globalThreshold).to.eq(threshold);
          expect(preorder.globalSoldUnits).to.eq(1);
        });
    },
  );

  it(
    "should set end date on preorder variant",
    { tags: ["@preorders", "@allEnv"] },
    () => {
      const variant = variantsList[0];
      checkoutData.variantsList = [variant];

      activatePreorderOnVariant({ variantId: variant.id });
      cy.visit(variantDetailsUrl(product.id, variant.id));
      setUpPreorderEndDate(endDate, endTime);
      saveVariant("VariantUpdate");
      getVariant(variant.id, defaultChannel.slug).then(({ preorder }) => {
        const respEndDate = new Date(preorder.endDate);
        expect(endDate).to.eq(formatDate(respEndDate));
        expect(endTime).to.eq(formatTime(respEndDate));
      });
    },
  );
});
