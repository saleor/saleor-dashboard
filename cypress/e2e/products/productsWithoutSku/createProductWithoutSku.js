/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { PRODUCT_DETAILS } from "../../../elements/catalog/products/product-details";
import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { AVAILABLE_CHANNELS_FORM } from "../../../elements/channels/available-channels-form";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { urlList } from "../../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../../fixtures/users";
import {
  createProduct,
  updateChannelInProduct,
} from "../../../support/api/requests/Product";
import { createTypeProduct } from "../../../support/api/requests/ProductType";
import {
  deleteChannelsStartsWith,
  getDefaultChannel,
} from "../../../support/api/utils/channelsUtils";
import { createWaitingForCaptureOrder } from "../../../support/api/utils/ordersUtils";
import * as productUtils from "../../../support/api/utils/products/productsUtils";
import * as shippingUtils from "../../../support/api/utils/shippingUtils";
import { getProductVariants } from "../../../support/api/utils/storeFront/storeFrontProductUtils";
import {
  createFirstVariant,
  createVariant,
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

  xit(
    "should create variant without sku by variant creator",
    { tags: ["@products", "@allEnv"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const price = 10;
      let createdProduct;

      createProduct({
        attributeId: attribute.id,
        name,
        productTypeId: productType.id,
        categoryId: category.id,
      })
        .then(resp => {
          createdProduct = resp;
          updateChannelInProduct({
            productId: createdProduct.id,
            channelId: defaultChannel.id,
          });
          cy.visit(`${urlList.products}${createdProduct.id}`);
          cy.waitForProgressBarToNotBeVisible();
          createVariant({
            price,
            attributeName: attributeValues[0],
          });
          getProductVariants(createdProduct.id, defaultChannel.slug);
        })
        .then(([variant]) => {
          expect(variant).to.have.property("name", attributeValues[0]);
          expect(variant).to.have.property("price", price);
          createWaitingForCaptureOrder({
            channelSlug: defaultChannel.slug,
            email: "example@example.com",
            variantsList: [variant],
            shippingMethodName: shippingMethod.name,
            address,
          });
        })
        .then(({ order }) => {
          expect(order.id).to.be.ok;
        });
    },
  );

  xit(
    "should create variant without sku",
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
          createVariant({
            warehouseName: warehouse.name,
            attributeName: variants[1].name,
            price: variants[1].price,
            channelName: defaultChannel.name,
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
        .get(PRODUCT_DETAILS.productNameInput)
        .type(name)
        .fillAutocompleteSelect(
          PRODUCT_DETAILS.productTypeInput,
          simpleProductType.name,
        )
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
        .get(PRODUCT_DETAILS.addWarehouseButton)
        .click();
      cy.contains(PRODUCT_DETAILS.warehouseOption, warehouse.name)
        .click()
        .get(PRODUCT_DETAILS.stockInput)
        .clearAndType(10)
        .get(AVAILABLE_CHANNELS_FORM.assignedChannels)
        .click()
        .get(
          `${AVAILABLE_CHANNELS_FORM.availableForPurchaseRadioButtons}${AVAILABLE_CHANNELS_FORM.radioButtonsValueTrue}`,
        )
        .click()
        .get(
          `${AVAILABLE_CHANNELS_FORM.publishedRadioButtons}${AVAILABLE_CHANNELS_FORM.radioButtonsValueTrue}`,
        )
        .click()
        .addAliasToGraphRequest("ProductDetails")
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear()
        .wait("@ProductDetails")
        .then(({ response }) => {
          const variants = [response.body.data.product.variants[0]];
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
