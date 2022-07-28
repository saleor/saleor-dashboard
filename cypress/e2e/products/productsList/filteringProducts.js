/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { urlList } from "../../../fixtures/urlList";
import { createCollection } from "../../../support/api/requests/Collections";
import { updateProduct } from "../../../support/api/requests/Product";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith,
} from "../../../support/api/utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith,
} from "../../../support/api/utils/shippingUtils";
import {
  selectChannel,
  selectFilterOption,
  selectProductsOutOfStock,
} from "../../../support/pages/catalog/products/productsListPage";

describe("As an admin I should be able to filter products", () => {
  const startsWith = "CyFilterProducts-";
  const name = `${startsWith}${faker.datatype.number()}`;
  const stockQuantity = 747;
  const price = 342;
  let attribute;
  let productType;
  let category;
  let warehouse;
  let channel;
  let collection;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteShippingStartsWith(startsWith);
    deleteProductsStartsWith(startsWith);
    createTypeAttributeAndCategoryForProduct({ name }).then(
      ({
        attribute: attributeResp,
        productType: productTypeResp,
        category: categoryResp,
      }) => {
        attribute = attributeResp;
        productType = productTypeResp;
        category = categoryResp;
      },
    );
    createCollection(name).then(
      collectionResp => (collection = collectionResp),
    );
    getDefaultChannel()
      .then(channelResp => {
        channel = channelResp;
        cy.fixture("addresses");
      })
      .then(addresses => {
        createShipping({
          channelId: channel.id,
          name,
          address: addresses.plAddress,
        });
      })
      .then(({ warehouse: warehouseResp }) => {
        warehouse = warehouseResp;
        createProductInChannel({
          name,
          channelId: channel.id,
          warehouseId: warehouse.id,
          quantityInWarehouse: stockQuantity,
          price,
          attributeId: attribute.id,
          categoryId: category.id,
          productTypeId: productType.id,
        });
      })
      .then(({ product: product }) => {
        updateProduct(product.id, { collections: [collection.id] });
      });
  });

  beforeEach(() => {
    cy.clearSessionData()
      .loginUserViaRequest()
      .visit(urlList.products);
  });

  const filterProductsBy = [
    { type: "category", testCase: "SALEOR_2601" },
    { type: "productType", testCase: "SALEOR_2602" },
    { type: "collection", testCase: "SALEOR_2603" },
  ];
  filterProductsBy.forEach(filterBy => {
    it(
      `should filter products by ${filterBy.type}. TC: ${filterBy.testCase}`,
      { tags: ["@productsList", "@allEnv"] },
      () => {
        cy.expectSkeletonIsVisible().waitForProgressBarToNotExist();
        selectFilterOption(filterBy.type, name);
        cy.getTextFromElement(PRODUCTS_LIST.productsNames).then(product => {
          expect(product).to.includes(name);
        });
      },
    );
  });

  it(
    "should filter products out of stock. TC: SALEOR_2604",
    { tags: ["@productsList", "@allEnv"] },
    () => {
      cy.expectSkeletonIsVisible();
      const productOutOfStock = `${startsWith}${faker.datatype.number()}`;
      createProductInChannel({
        name: productOutOfStock,
        channelId: channel.id,
        warehouseId: warehouse.id,
        quantityInWarehouse: 0,
        productTypeId: productType.id,
        attributeId: attribute.id,
        categoryId: category.id,
        price,
      });
      cy.waitForProgressBarToNotExist();
      selectChannel(channel.slug);
      selectProductsOutOfStock();
      cy.searchInTable(productOutOfStock)
        .get(PRODUCTS_LIST.productsNames)
        .should("have.length", 1)
        .getTextFromElement(PRODUCTS_LIST.productsNames)
        .then(product => {
          expect(product).to.includes(productOutOfStock);
        });
    },
  );
});
