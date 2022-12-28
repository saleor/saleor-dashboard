/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { PRODUCT_DETAILS } from "../../../elements/catalog/products/product-details";
import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { VARIANTS_SELECTORS } from "../../../elements/catalog/products/variants-selectors";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import { productVariantDetailUrl, urlList } from "../../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../../fixtures/users";
import * as productRequest from "../../../support/api/requests/Product";
import { createTypeProduct } from "../../../support/api/requests/ProductType";
import {
  deleteChannelsStartsWith,
  getDefaultChannel,
} from "../../../support/api/utils/channelsUtils";
import { createWaitingForCaptureOrder } from "../../../support/api/utils/ordersUtils";
import * as productUtils from "../../../support/api/utils/products/productsUtils";
import * as shippingUtils from "../../../support/api/utils/shippingUtils";
import { getProductVariants } from "../../../support/api/utils/storeFront/storeFrontProductUtils";
import { deleteWarehouseStartsWith } from "../../../support/api/utils/warehouseUtils";
import { enterVariantEditPage } from "../../../support/pages/catalog/products/productDetailsPage";
import {
  createVariant,
  selectChannelsForVariant,
} from "../../../support/pages/catalog/products/VariantsPage";
import { selectChannelInDetailsPages } from "../../../support/pages/channelsPage";

describe("Creating variants", () => {
  const startsWith = "CreateProdSku";
  const attributeValues = ["value1", "value2"];

  let defaultChannel;
  let warehouse;
  let attribute;
  let productType;
  let simpleProductType;
  let category;
  let shippingMethod;
  let address;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    shippingUtils.deleteShippingStartsWith(startsWith);
    productUtils.deleteProductsStartsWith(startsWith);
    deleteChannelsStartsWith(startsWith);
    deleteWarehouseStartsWith(startsWith);

    const name = `${startsWith}${faker.datatype.number()}`;
    const simpleProductTypeName = `${startsWith}${faker.datatype.number()}`;
    getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        cy.fixture("addresses");
      })
      .then(fixtureAddresses => {
        address = fixtureAddresses.usAddress;
        shippingUtils.createShipping({
          channelId: defaultChannel.id,
          name,
          address,
        });
      })
      .then(
        ({ warehouse: warehouseResp, shippingMethod: shippingMethodResp }) => {
          warehouse = warehouseResp;
          shippingMethod = shippingMethodResp;
        },
      );
    productUtils
      .createTypeAttributeAndCategoryForProduct({ name, attributeValues })
      .then(
        ({
          attribute: attributeResp,
          productType: productTypeResp,
          category: categoryResp,
        }) => {
          attribute = attributeResp;
          productType = productTypeResp;
          category = categoryResp;
          createTypeProduct({
            name: simpleProductTypeName,
            attributeId: attribute.id,
            hasVariants: false,
          });
        },
      )
      .then(type => {
        simpleProductType = type;
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest(
      "auth",
      ONE_PERMISSION_USERS.product,
    );
  });

  it(
    "should be able to add SKU to simple product TC: SALEOR_2802",
    { tags: ["@products", "@allEnv"] },
    () => {
      const productName = `${startsWith}${faker.datatype.number()}`;
      let product;
      let variant;
      const sku = `NewSku${faker.datatype.number()}`;

      productUtils
        .createProductInChannelWithoutVariants({
          name: productName,
          channelId: defaultChannel.id,
          productTypeId: simpleProductType.id,
          attributeId: attribute.id,
          categoryId: category.id,
        })
        .then(productResp => {
          product = productResp;
          productRequest.createVariantForSimpleProduct({
            productId: product.id,
            warehouseId: warehouse.id,
            quantityInWarehouse: 10,
            trackInventory: false,
          });
        })
        .then(variantResp => {
          variant = variantResp;
          productRequest.updateChannelPriceInVariant(
            variant.id,
            defaultChannel.id,
          );
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
    "should create variant without sku TC: SALEOR_2807",
    { tags: ["@products", "@allEnv"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const variants = [{ price: 7 }, { name: attributeValues[1], price: 16 }];
      let createdProduct;

      productUtils
        .createProductInChannel({
          name,
          attributeId: attribute.id,
          channelId: defaultChannel.id,
          warehouseId: warehouse.id,
          productTypeId: productType.id,
          categoryId: category.id,
          price: variants[0].price,
        })
        .then(({ product: productResp }) => {
          createdProduct = productResp;
          cy.visit(`${urlList.products}${createdProduct.id}`);
          enterVariantEditPage();
          cy.get(PRODUCT_DETAILS.addVariantButton)
            .click()
            .then(() => {
              createVariant({
                attributeName: variants[1].name,
                price: variants[1].price,
                channelName: defaultChannel.name,
                warehouseId: warehouse.id,
              });
            });
        })
        .then(() => {
          getProductVariants(createdProduct.id, defaultChannel.slug);
        })
        .then(([firstVariant, secondVariant]) => {
          expect(firstVariant).to.have.property("price", variants[0].price);
          expect(secondVariant).to.have.property("name", variants[1].name);
          expect(secondVariant).to.have.property("price", variants[1].price);
          createWaitingForCaptureOrder({
            channelSlug: defaultChannel.slug,
            email: "example@example.com",
            variantsList: [secondVariant],
            shippingMethodName: shippingMethod.name,
            address,
          });
        })
        .then(({ order }) => {
          expect(order.id).to.be.ok;
        });
    },
  );

  it(
    "should create simple product without sku SALEOR_2806",
    { tags: ["@products", "@allEnv"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;

      cy.visit(urlList.products)
        .get(PRODUCTS_LIST.createProductBtn)
        .click()
        .fillAutocompleteSelect(
          PRODUCTS_LIST.dialogProductTypeInput,
          simpleProductType.name,
        );
      cy.get(BUTTON_SELECTORS.submit).click();
      cy.get(PRODUCT_DETAILS.productNameInput)
        .type(name)
        .fillAutocompleteSelect(PRODUCT_DETAILS.categoryInput);
      selectChannelInDetailsPages(defaultChannel.name);
      cy.get(PRODUCT_DETAILS.costPriceInput)
        .type(10)
        .get(PRODUCT_DETAILS.sellingPriceInput)
        .type(10)
        .addAliasToGraphRequest("VariantCreate")
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear()
        .wait("@VariantCreate")
        .then(({ response }) => {
          const variantId =
            response.body.data.productVariantCreate.productVariant.id;
          productRequest.updateVariantWarehouse({
            variantId,
            warehouseId: warehouse.id,
          });
        });
      enterVariantEditPage();
      cy.addAliasToGraphRequest("ProductVariantDetails");
      selectChannelsForVariant();
      cy.get(PRODUCT_DETAILS.stockInput)
        .parents()
        .contains(warehouse.name)
        .get(PRODUCT_DETAILS.stockInput)
        .clearAndType(10)
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear()
        .wait("@ProductVariantDetails")
        .then(({ response }) => {
          const variants = [
            response.body.data.productVariant.product.variants[0],
          ];
          createWaitingForCaptureOrder({
            channelSlug: defaultChannel.slug,
            email: "example@example.com",
            variantsList: variants,
            shippingMethodName: shippingMethod.name,
            address,
          })
            .its("order.id")
            .should("be.ok");
        });
    },
  );
});
