/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { SHARED_ELEMENTS } from "../../../elements";
import { urlList } from "../../../fixtures/urlList";
import { createCollection } from "../../../support/api/requests/Collections";
import { updateProduct } from "../../../support/api/requests/Product";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
} from "../../../support/api/utils/products/productsUtils";
import { createShipping } from "../../../support/api/utils/shippingUtils";
import {
  filterProductsWithNewFilters,
  selectChannel,
  selectProductsOutOfStock,
} from "../../../support/pages/catalog/products/productsListPage";

/*
  Todo: https://github.com/saleor/saleor-dashboard/issues/4300
*/
describe("As an admin I should be able to filter products", () => {
  const startsWith = "ACyFilterProducts-";
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
    cy.loginUserViaRequest();
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
        cy.checkIfDataAreNotNull({
          attribute,
          productType,
          category,
          warehouse,
          channel,
          collection,
        });
      });
  });

  beforeEach(() => {
    cy.loginUserViaRequest().visit(urlList.products);
  });

  const filterProductsBy = [
    { type: "Category", testCase: "SALEOR_2601" },
    { type: "Product type", testCase: "SALEOR_2602" },
    { type: "Collection", testCase: "SALEOR_2603" },
  ];
  filterProductsBy.forEach(filterBy => {
    it(
      `should filter products by ${filterBy.type}. TC: ${filterBy.testCase}`,
      { tags: ["@productsList", "@allEnv", "@stable"] },
      () => {
        cy.addAliasToGraphRequest("ProductList");
        filterProductsWithNewFilters(filterBy.type, name);
        cy.get(SHARED_ELEMENTS.dataGridTable).contains(name).should("exist");
      },
    );
  });

  it.skip(
    "should filter products out of stock. TC: SALEOR_2604",
    { tags: ["@productsList", "@allEnv", "@stable"] },
    () => {
      const productOutOfStock = `${startsWith}${faker.datatype.number()}`;
      cy.addAliasToGraphRequest("ProductList");
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
      selectChannel(channel.slug);
      selectProductsOutOfStock();
      cy.get(SHARED_ELEMENTS.dataGridTable)
        .contains(productOutOfStock)
        .should("exist");
    },
  );
});
