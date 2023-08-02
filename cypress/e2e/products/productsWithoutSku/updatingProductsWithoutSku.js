/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import {
  VARIANTS_SELECTORS,
} from "../../../elements/catalog/products/variants-selectors";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import { productVariantDetailUrl } from "../../../fixtures/urlList";
import {
  createVariant,
  createVariantForSimpleProduct,
  getVariant,
  updateChannelPriceInVariant,
} from "../../../support/api/requests/Product";
import { createTypeProduct } from "../../../support/api/requests/ProductType";
import {
  createWaitingForCaptureOrder,
} from "../../../support/api/utils/ordersUtils";
import * as productUtils
  from "../../../support/api/utils/products/productsUtils";
import * as shippingUtils from "../../../support/api/utils/shippingUtils";
import {
  deleteWarehouseStartsWith,
} from "../../../support/api/utils/warehouseUtils";

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
    cy.loginUserViaRequest();
    productUtils.deleteProductsStartsWith(startsWith);
    shippingUtils.deleteShippingStartsWith(startsWith);
    deleteWarehouseStartsWith(startsWith);

    cy.fixture("addresses").then(fixtureAddresses => {
      address = fixtureAddresses.plAddress;
    });
    productUtils
      .createShippingProductTypeAttributeAndCategory(name, attributeValues)
      .then(resp => {
        cy.log(resp);
        attribute = resp.attribute;
        productTypeWithVariants = resp.productType;
        category = resp.category;
        defaultChannel = resp.defaultChannel;
        warehouse = resp.warehouse;
        shippingMethod = resp.shippingMethod;

        createTypeProduct({
          name: productTypeWithoutVariantsName,
          attributeId: attribute.id,
          hasVariants: false,
        });
      })
      .then(productTypeResp => {
        productTypeWithoutVariants = productTypeResp;
        productUtils.createProductInChannelWithoutVariants({
          name,
          channelId: defaultChannel.id,
          attributeId: attribute.id,
          productTypeId: productTypeWithVariants.id,
          categoryId: category.id,
        });
      })
      .then(productResp => {
        product = productResp;
        cy.checkIfDataAreNotNull({
          defaultChannel,
          address,
          warehouse,
          shippingMethod,
          attribute,
          category,
          productTypeWithVariants,
          productTypeWithoutVariants,
          product,
        });
      });
  });

  beforeEach(() => {
    cy.loginUserViaRequest();
  });
  it(
    "should be able to add SKU to simple product TC: SALEOR_2802",
    { tags: ["@products", "@allEnv"] },
    () => {
      const productName = `${startsWith}${faker.datatype.number()}`;
      const sku = `Sku${faker.datatype.number()}`;
      let product;
      let variant;

      const productData = {
        name: productName,
        attributeId: attribute.id,
        categoryId: category.id,
        productTypeId: productTypeWithoutVariants.id,
        channelId: defaultChannel.id,
        warehouseId: warehouse.id,
        quantityInWarehouse: 10,
        trackInventory: false,
      };
      createSimpleProductWithVariant(productData).then(resp => {
        product = resp.product;
        variant = resp.variant;

        cy.visitAndWaitForProgressBarToDisappear(
          productVariantDetailUrl(product.id, variant.id),
        )
          .get(SHARED_ELEMENTS.skeleton)
          .should("not.exist")
          .get(VARIANTS_SELECTORS.skuTextField)
          .scrollIntoView()
          .type(sku, { force: true })
          .addAliasToGraphRequest("VariantUpdate")
          .get(BUTTON_SELECTORS.confirm)
          .click()
          .waitForRequestAndCheckIfNoErrors("@VariantUpdate")
          .then(({ response }) => {
            const responseSku =
              response.body.data.productVariantUpdate.productVariant.sku;
            expect(responseSku).to.equal(sku);
          });
      });
    },
  );

  it(
    "should add sku to variant TC: SALEOR_2803",
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
            .get(VARIANTS_SELECTORS.skuTextField)
            .type(sku, { force: true })
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
    "should remove sku from variant TC: SALEOR_2805",
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
            .get(VARIANTS_SELECTORS.skuTextField)
            .clear()
            .addAliasToGraphRequest("VariantUpdate")
            .get(VARIANTS_SELECTORS.variantNameInput)
            .type(name)
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

  function createSimpleProductWithVariant({
    name,
    channelId,
    warehouseId = null,
    quantityInWarehouse = 10,
    productTypeId,
    attributeId,
    categoryId,
    trackInventory = true,
  }) {
    let product;
    let variant;

    return productUtils
      .createProductInChannelWithoutVariants({
        name,
        channelId,
        productTypeId,
        attributeId,
        categoryId,
      })
      .then(productResp => {
        product = productResp;
        createVariantForSimpleProduct({
          productId: product.id,
          warehouseId,
          quantityInWarehouse,
          trackInventory,
        });
      })
      .then(variantResp => {
        variant = variantResp;
        updateChannelPriceInVariant(variant.id, defaultChannel.id);
      })
      .then(() => ({ product, variant }));
  }
});
