/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { PRODUCT_DETAILS } from "../../../elements/catalog/products/product-details";
import { VARIANTS_SELECTORS } from "../../../elements/catalog/products/variants-selectors";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import {
  productDetailsUrl,
  productVariantDetailUrl,
} from "../../../fixtures/urlList";
import {
  createVariant,
  getVariant,
} from "../../../support/api/requests/Product";
import {
  createTypeProduct,
  productAttributeAssignmentUpdate,
} from "../../../support/api/requests/ProductType";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import { createWaitingForCaptureOrder } from "../../../support/api/utils/ordersUtils";
import {
  createProductInChannelWithoutVariants,
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith,
} from "../../../support/api/utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith,
} from "../../../support/api/utils/shippingUtils";

describe("Updating products without sku", () => {
  const startsWith = "UpdateProductsSku";

  let defaultChannel;
  let address;
  let warehouse;
  let shippingMethod;
  let attribute;
  let category;
  let productTypeWithVariants;
  let productTypeWithoutVariants;
  let product;

  const name = `${startsWith}${faker.datatype.number()}`;
  const productTypeWithoutVariantsName = `${startsWith}${faker.datatype.number()}`;
  const email = "example@example.com";
  const attributeValues = ["value1", "value2"];

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteProductsStartsWith(startsWith);
    deleteShippingStartsWith(startsWith);
    getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        cy.fixture("addresses");
      })
      .then(fixtureAddresses => {
        address = fixtureAddresses.plAddress;
        createShipping({
          channelId: defaultChannel.id,
          name,
          address,
        });
      })
      .then(
        ({ warehouse: warehouseResp, shippingMethod: shippingMethodResp }) => {
          warehouse = warehouseResp;
          shippingMethod = shippingMethodResp;
          createTypeAttributeAndCategoryForProduct({ name, attributeValues });
        },
      )
      .then(
        ({
          attribute: attributeResp,
          productType: productTypeResp,
          category: categoryResp,
        }) => {
          attribute = attributeResp;
          productTypeWithVariants = productTypeResp;
          category = categoryResp;
          productAttributeAssignmentUpdate({
            productTypeId: productTypeWithVariants.id,
            attributeId: attribute.id,
          });
          createTypeProduct({
            name: productTypeWithoutVariantsName,
            attributeId: attribute.id,
            hasVariants: false,
          });
        },
      )
      .then(productTypeResp => {
        productTypeWithoutVariants = productTypeResp;
        productAttributeAssignmentUpdate({
          productTypeId: productTypeWithoutVariants.id,
          attributeId: attribute.id,
        });
        createProductInChannelWithoutVariants({
          name,
          channelId: defaultChannel.id,
          attributeId: attribute.id,
          productTypeId: productTypeWithVariants.id,
          categoryId: category.id,
        });
      })
      .then(productResp => (product = productResp));
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should add sku to simple product",
    { tags: ["@products", "@allEnv", "@stable"] },
    () => {
      const sku = "NewSkuSimpleProd";
      const simpleProductName = `${startsWith}${faker.datatype.number()}`;
      let simpleProduct;
      createProductInChannelWithoutVariants({
        name: simpleProductName,
        attributeId: attribute.id,
        categoryId: category.id,
        channelId: defaultChannel.id,
        productTypeId: productTypeWithoutVariants.id,
      })
        .then(productResp => {
          simpleProduct = productResp;
          createVariant({
            productId: simpleProduct.id,
            channelId: defaultChannel.id,
            warehouseId: warehouse.id,
            quantityInWarehouse: 10,
          });
        })
        .then(variantsList => {
          cy.visitAndWaitForProgressBarToDisappear(
            productDetailsUrl(simpleProduct.id),
          )
            .get(SHARED_ELEMENTS.skeleton)
            .should("not.exist")
            .get(PRODUCT_DETAILS.skuInput)
            .type(sku)
            .addAliasToGraphRequest("SimpleProductUpdate")
            .get(BUTTON_SELECTORS.confirm)
            .click()
            .waitForRequestAndCheckIfNoErrors("@SimpleProductUpdate");
          getVariant(variantsList[0].id, defaultChannel.slug);
        })
        .then(variantResp => {
          expect(variantResp.sku).to.eq(sku);
        });
    },
  );

  it(
    "should add sku to variant",
    { tags: ["@products", "@allEnv", "@stable"] },
    () => {
      const sku = "NewSku";
      let variant;
      createVariant({
        attributeId: attribute.id,
        channelId: defaultChannel.id,
        productId: product.id,
        quantityInWarehouse: 10,
        warehouseId: warehouse.id,
        attributeName: attributeValues[0],
      })
        .then(variantResp => {
          variant = variantResp[0];
          cy.visitAndWaitForProgressBarToDisappear(
            productVariantDetailUrl(product.id, variant.id),
          )
            .get(SHARED_ELEMENTS.skeleton)
            .should("not.exist")
            .get(VARIANTS_SELECTORS.skuInput)
            .type(sku)
            .addAliasToGraphRequest("VariantUpdate")
            .get(BUTTON_SELECTORS.confirm)
            .click()
            .waitForRequestAndCheckIfNoErrors("@VariantUpdate");
          getVariant(variant.id, defaultChannel.slug);
        })
        .then(variantResp => {
          expect(variantResp.sku).to.equal(sku);
        });
    },
  );

  it(
    "should remove sku from variant",
    { tags: ["@products", "@allEnv", "@stable"] },
    () => {
      let variant;
      createVariant({
        attributeId: attribute.id,
        channelId: defaultChannel.id,
        productId: product.id,
        quantityInWarehouse: 10,
        warehouseId: warehouse.id,
        sku: name,
        attributeName: attributeValues[1],
      })
        .then(variantResp => {
          variant = variantResp[0];
          cy.visitAndWaitForProgressBarToDisappear(
            productVariantDetailUrl(product.id, variant.id),
          )
            .get(SHARED_ELEMENTS.skeleton)
            .should("not.exist")
            .get(VARIANTS_SELECTORS.skuInput)
            .clear()
            .addAliasToGraphRequest("VariantUpdate")
            .get(BUTTON_SELECTORS.confirm)
            .click()
            .waitForRequestAndCheckIfNoErrors("@VariantUpdate");
          getVariant(variant.id, defaultChannel.slug);
        })
        .then(variantResp => {
          expect(variantResp.sku).to.be.null;
          checkIfCheckoutForVariantCanBeCompleted(variantResp);
        });
    },
  );

  it(
    "should remove sku from simple product",
    { tags: ["@products", "@allEnv", "@stable"] },
    () => {
      const simpleProductName = `${startsWith}${faker.datatype.number()}`;
      let simpleProduct;
      createProductInChannelWithoutVariants({
        name: simpleProductName,
        attributeId: attribute.id,
        categoryId: category.id,
        channelId: defaultChannel.id,
        productTypeId: productTypeWithoutVariants.id,
      })
        .then(productResp => {
          simpleProduct = productResp;
          createVariant({
            productId: simpleProduct.id,
            channelId: defaultChannel.id,
            sku: simpleProductName,
            quantityInWarehouse: 10,
            warehouseId: warehouse.id,
          });
        })
        .then(variantsList => {
          cy.visitAndWaitForProgressBarToDisappear(
            productDetailsUrl(simpleProduct.id),
          )
            .get(SHARED_ELEMENTS.skeleton)
            .should("not.exist")
            .get(PRODUCT_DETAILS.skuInput)
            .clear()
            .addAliasToGraphRequest("SimpleProductUpdate")
            .get(BUTTON_SELECTORS.confirm)
            .click()
            .waitForRequestAndCheckIfNoErrors("@SimpleProductUpdate");
          getVariant(variantsList[0].id, defaultChannel.slug);
        })
        .then(variantResp => {
          expect(variantResp.sku).to.be.null;
          checkIfCheckoutForVariantCanBeCompleted(variantResp);
        });
    },
  );

  function checkIfCheckoutForVariantCanBeCompleted(variant) {
    createWaitingForCaptureOrder({
      address,
      channelSlug: defaultChannel.slug,
      email,
      shippingMethodName: shippingMethod.name,
      variantsList: [variant],
    }).then(({ order }) => {
      expect(order.id).to.be.ok;
    });
  }
});
