/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { PRODUCT_DETAILS } from "../../../elements/catalog/products/product-details";
import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { urlList } from "../../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../../fixtures/users";
import { updateVariantWarehouse } from "../../../support/api/requests/Product";
import { createTypeProduct } from "../../../support/api/requests/ProductType";
import {
  deleteChannelsStartsWith,
  getDefaultChannel,
} from "../../../support/api/utils/channelsUtils";
import { createWaitingForCaptureOrder } from "../../../support/api/utils/ordersUtils";
import * as productUtils from "../../../support/api/utils/products/productsUtils";
import * as shippingUtils from "../../../support/api/utils/shippingUtils";
import { enterVariantEditPage } from "../../../support/pages/catalog/products/productDetailsPage";
import { selectChannelsForVariant } from "../../../support/pages/catalog/products/VariantsPage";
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
        cy.checkIfDataAreNotNull({defaultChannel,warehouse,attribute,productType,simpleProductType,category,shippingMethod,address})
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest(
      "auth",
      ONE_PERMISSION_USERS.product,
    );
  });

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

          updateVariantWarehouse({ variantId, warehouseId: warehouse.id });
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
