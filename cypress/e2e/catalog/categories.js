/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import {
  CATEGORIES_LIST,
  categoryRow,
} from "../../elements/catalog/categories/categories-list";
import { CATEGORY_DETAILS } from "../../elements/catalog/categories/category-details";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { categoryDetailsUrl, urlList } from "../../fixtures/urlList";
import {
  createCategory as createCategoryRequest,
  getCategory,
} from "../../support/api/requests/Category";
import { deleteCategoriesStartsWith } from "../../support/api/utils/catalog/categoryUtils";
import * as channelsUtils from "../../support/api/utils/channelsUtils";
import * as productsUtils from "../../support/api/utils/products/productsUtils";
import { deleteShippingStartsWith } from "../../support/api/utils/shippingUtils";
import {
  createCategory,
  updateCategory,
} from "../../support/pages/catalog/categoriesPage";

describe("As an admin I want to manage categories", () => {
  const startsWith = "CyCategories";
  const name = `${startsWith}${faker.datatype.number()}`;

  let attribute;
  let category;
  let productType;
  let product;

  let defaultChannel;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    productsUtils.deleteProductsStartsWith(startsWith);
    deleteCategoriesStartsWith(startsWith);
    deleteShippingStartsWith(startsWith);
    channelsUtils.deleteChannelsStartsWith(startsWith);

    channelsUtils
      .getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        productsUtils.createTypeAttributeAndCategoryForProduct({ name });
      })
      .then(
        ({
          category: categoryResp,
          attribute: attributeResp,
          productType: productTypeResp,
        }) => {
          category = categoryResp;
          attribute = attributeResp;
          productType = productTypeResp;
          productsUtils.createProductInChannel({
            name,
            channelId: defaultChannel.id,
            productTypeId: productType.id,
            attributeId: attribute.id,
            categoryId: category.id,
          });
        },
      )
      .then(({ product: productResp }) => (product = productResp));
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should be able to create category. TC: SALEOR_0201",
    { tags: ["@category", "@allEnv"] },
    () => {
      const categoryName = `${startsWith}${faker.datatype.number()}`;

      cy.visit(urlList.categories)
        .get(CATEGORIES_LIST.addCategoryButton)
        .click();
      createCategory({ name: categoryName, description: categoryName })
        .its("response.body.data.categoryCreate.category")
        .then(newCategory => {
          getCategory(newCategory.id);
        })
        .then(newCategory => {
          expect(newCategory.name).to.eq(categoryName);
          const descriptionResp = JSON.parse(newCategory.description);
          expect(descriptionResp.blocks[0].data.text).to.eq(categoryName);
        });
    },
  );

  it(
    "should be able to create category as subcategory. TC: SALEOR_0202",
    { tags: ["@category", "@allEnv", "@stable"] },
    () => {
      const categoryName = `${startsWith}${faker.datatype.number()}`;

      cy.visit(categoryDetailsUrl(category.id))
        .get(CATEGORY_DETAILS.createSubcategoryButton)
        .click();
      createCategory({ name: categoryName, description: categoryName })
        .visit(categoryDetailsUrl(category.id))
        .contains(CATEGORY_DETAILS.categoryChildrenRow, categoryName)
        .should("be.visible");
      getCategory(category.id).then(categoryResp => {
        expect(categoryResp.children.edges[0].node.name).to.eq(categoryName);
      });
    },
  );

  it(
    "should be able to add product to category. TC: SALEOR_0203",
    { tags: ["@category", "@allEnv", "@stable"] },
    () => {
      cy.visit(categoryDetailsUrl(category.id))
        .get(CATEGORY_DETAILS.productsTab)
        .click()
        .get(CATEGORY_DETAILS.addProducts)
        .click()
        .url()
        .should("include", urlList.addProduct);
    },
  );

  it(
    "should be able to remove product from category. TC: SALEOR_0204",
    { tags: ["@category", "@allEnv"] },
    () => {
      cy.visit(categoryDetailsUrl(category.id))
        .get(CATEGORY_DETAILS.productsTab)
        .click();
      cy.contains(CATEGORY_DETAILS.productRow, product.name)
        .find(BUTTON_SELECTORS.checkbox)
        .click()
        .get(BUTTON_SELECTORS.deleteIcon)
        .click()
        .addAliasToGraphRequest("productBulkDelete")
        .get(BUTTON_SELECTORS.submit)
        .click()
        .confirmationMessageShouldDisappear();
      cy.contains(CATEGORY_DETAILS.productRow, product.name)
        .should("not.exist")
        .waitForRequestAndCheckIfNoErrors("@productBulkDelete");
      getCategory(category.id).then(categoryResp => {
        expect(categoryResp.products.edges.length).to.be.eq(0);
      });
    },
  );

  it(
    "should be able to enter category details page. TC: SALEOR_0205",
    { tags: ["@category", "@allEnv"] },
    () => {
      cy.visit(urlList.categories)
        .get(SHARED_ELEMENTS.searchInput)
        .type(category.name);
      cy.contains(SHARED_ELEMENTS.tableRow, category.name).click();
      cy.contains(SHARED_ELEMENTS.header, category.name).should("be.visible");
    },
  );

  it(
    "should be able to delete category. TC: SALEOR_0206",
    { tags: ["@category", "@allEnv", "@stable"] },
    () => {
      const categoryName = `${startsWith}${faker.datatype.number()}`;

      createCategoryRequest({
        name: categoryName,
      }).then(categoryResp => {
        cy.visit(categoryDetailsUrl(categoryResp.id))
          .get(BUTTON_SELECTORS.deleteButton)
          .click()
          .addAliasToGraphRequest("CategoryDelete")
          .get(BUTTON_SELECTORS.submit)
          .click()
          .waitForRequestAndCheckIfNoErrors("@CategoryDelete");
        getCategory(categoryResp.id).should("be.null");
      });
    },
  );

  it(
    "should be able to update category. TC: SALEOR_0207",
    { tags: ["@category", "@allEnv", "@stable"] },
    () => {
      const categoryName = `${startsWith}${faker.datatype.number()}`;
      const updatedName = `${startsWith}updatedCategory`;

      createCategoryRequest({
        name: categoryName,
      })
        .then(categoryResp => {
          cy.visitAndWaitForProgressBarToDisappear(
            categoryDetailsUrl(categoryResp.id),
          );
          updateCategory({ name: updatedName, description: updatedName });
          getCategory(categoryResp.id);
        })
        .then(categoryResp => {
          expect(categoryResp.name).to.eq(updatedName);
          const descriptionJson = JSON.parse(categoryResp.description);
          const descriptionText = descriptionJson.blocks[0].data.text;
          expect(descriptionText).to.eq(updatedName);
        });
    },
  );

  it(
    "should be able to delete several categories on categories list page. TC: SALEOR_0209",
    { tags: ["@category", "@allEnv"] },
    () => {
      const firstCategoryName = `${startsWith}${faker.datatype.number()}`;
      const secondCategoryName = `${startsWith}${faker.datatype.number()}`;
      let firstCategory;
      let secondCategory;

      createCategoryRequest({
        name: firstCategoryName,
      }).then(categoryResp => {
        firstCategory = categoryResp;
      });

      createCategoryRequest({
        name: secondCategoryName,
      }).then(categoryResp => {
        secondCategory = categoryResp;
        cy.visit(urlList.categories)
          .searchInTable(startsWith)
          .get(categoryRow(firstCategory.id))
          .find(BUTTON_SELECTORS.checkbox)
          .click()
          .get(categoryRow(secondCategory.id))
          .find(BUTTON_SELECTORS.checkbox)
          .click()
          .get(BUTTON_SELECTORS.deleteIcon)
          .click()
          .addAliasToGraphRequest("CategoryBulkDelete")
          .get(BUTTON_SELECTORS.submit)
          .click()
          .waitForRequestAndCheckIfNoErrors("@CategoryBulkDelete");
        getCategory(firstCategory.id).should("be.null");
        getCategory(secondCategory.id).should("be.null");
      });
    },
  );

  it(
    "should be able to remove subcategory from category. TC: SALEOR_0208",
    { tags: ["@category", "@allEnv", "@stable"] },
    () => {
      const subCategoryName = `${startsWith}${faker.datatype.number()}`;
      const mainCategoryName = `${startsWith}${faker.datatype.number()}`;
      let subCategory;
      let mainCategory;

      createCategoryRequest({
        name: mainCategoryName,
      })
        .then(categoryResp => {
          mainCategory = categoryResp;
          createCategoryRequest({
            name: subCategoryName,
            parent: mainCategory.id,
          });
        })
        .then(categoryResp => {
          subCategory = categoryResp;
          cy.visit(categoryDetailsUrl(mainCategory.id))
            .get(categoryRow(subCategory.id))
            .find(BUTTON_SELECTORS.checkbox)
            .click()
            .get(BUTTON_SELECTORS.deleteIcon)
            .click()
            .addAliasToGraphRequest("CategoryBulkDelete")
            .get(BUTTON_SELECTORS.submit)
            .click()
            .waitForRequestAndCheckIfNoErrors("@CategoryBulkDelete");
          getCategory(subCategory.id).should("be.null");
          getCategory(mainCategory.id);
        })
        .then(categoryResp => {
          expect(categoryResp.children.edges).to.be.empty;
        });
    },
  );
});
