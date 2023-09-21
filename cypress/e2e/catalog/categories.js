/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { CATEGORIES_LIST_SELECTORS } from "../../elements/catalog/categories/categories-list";
import { CATEGORY_DETAILS_SELECTORS } from "../../elements/catalog/categories/category-details";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { categoryDetailsUrl, urlList } from "../../fixtures/urlList";
import {
  createCategory as createCategoryRequest,
  getCategory,
} from "../../support/api/requests/Category";
import * as channelsUtils from "../../support/api/utils/channelsUtils";
import * as productsUtils from "../../support/api/utils/products/productsUtils";
import { ensureCanvasStatic } from "../../support/customCommands/sharedElementsOperations/canvas";
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
    cy.loginUserViaRequest();

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
      .then(({ product: productResp }) => {
        product = productResp;
        cy.checkIfDataAreNotNull({
          attribute,
          category,
          productType,
          product,
          defaultChannel,
        });
      });
  });

  beforeEach(() => {
    cy.loginUserViaRequest();
  });

  it(
    "should be able to create category. TC: SALEOR_0201",
    { tags: ["@category", "@allEnv", "@oldRelease"] },
    () => {
      const categoryName = `${startsWith}${faker.datatype.number()}`;

      cy.visit(urlList.categories)
        .get(CATEGORIES_LIST_SELECTORS.addCategoryButton)
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
        .get(CATEGORY_DETAILS_SELECTORS.createSubcategoryButton)
        .click();
      createCategory({ name: categoryName, description: categoryName })
        .visit(categoryDetailsUrl(category.id))
        .get(SHARED_ELEMENTS.dataGridTable)
        .scrollIntoView();
      ensureCanvasStatic(SHARED_ELEMENTS.dataGridTable);

      cy.contains(SHARED_ELEMENTS.dataGridTable, categoryName).should(
        "be.visible",
      );
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
        .get(CATEGORY_DETAILS_SELECTORS.productsTab)
        .click()
        .get(CATEGORY_DETAILS_SELECTORS.addProducts)
        .click()
        .url()
        .should("include", urlList.addProduct);
    },
  );

  it(
    "should be able to remove product from category. TC: SALEOR_0204",
    { tags: ["@category", "@allEnv", "@stable"] },
    () => {
      cy.addAliasToGraphRequest("productBulkDelete");
      cy.visit(categoryDetailsUrl(category.id))
        .get(CATEGORY_DETAILS_SELECTORS.productsTab)
        .click();
      ensureCanvasStatic(SHARED_ELEMENTS.dataGridTable);
      cy.contains(SHARED_ELEMENTS.dataGridTable, product.name).should(
        "be.visible",
      );
      // selects first row
      cy.clickGridCell(0, 0);
      cy.get(CATEGORY_DETAILS_SELECTORS.deleteCategoriesButton)
        .click()
        .get(BUTTON_SELECTORS.submit)
        .click()
        .confirmationMessageShouldDisappear();
      cy.contains(SHARED_ELEMENTS.dataGridTable, product.name)
        .should("not.exist")
        .waitForRequestAndCheckIfNoErrors("@productBulkDelete");
      getCategory(category.id).then(categoryResp => {
        expect(categoryResp.products.edges.length).to.be.eq(0);
      });
    },
  );

  it(
    "should be able to enter category details page. TC: SALEOR_0205",
    { tags: ["@category", "@allEnv", "@stable"] },
    () => {
      cy.visit(urlList.categories)
        .get(SHARED_ELEMENTS.searchInput)
        .type(category.name);
      ensureCanvasStatic(SHARED_ELEMENTS.dataGridTable);
      cy.contains(SHARED_ELEMENTS.dataGridTable, category.name).should(
        "be.visible",
      );
      // opens first row details
      cy.clickGridCell(1, 0);
      cy.contains(SHARED_ELEMENTS.header, category.name).should("be.visible");
    },
  );

  it(
    "should be able to delete category. TC: SALEOR_0206",
    { tags: ["@category", "@allEnv", "@stable"] },
    () => {
      const categoryName = `${startsWith}${faker.datatype.number()}`;
      cy.addAliasToGraphRequest("CategoryDelete");

      createCategoryRequest({
        name: categoryName,
      }).then(categoryResp => {
        cy.visit(categoryDetailsUrl(categoryResp.id))
          .get(BUTTON_SELECTORS.deleteButton)
          .click()
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
    { tags: ["@category", "@allEnv", "@stable"] },
    () => {
      const firstCategoryName = `${startsWith}${faker.datatype.number()}`;
      const secondCategoryName = `${startsWith}${faker.datatype.number()}`;
      cy.addAliasToGraphRequest("CategoryBulkDelete");

      createCategoryRequest({
        name: firstCategoryName,
      });
      createCategoryRequest({
        name: secondCategoryName,
      }).then(() => {
        cy.visit(urlList.categories).searchInTable(startsWith);
        cy.deleteTwoFirstRecordsFromGridListAndValidate("CategoryBulkDelete");
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
      cy.addAliasToGraphRequest("CategoryBulkDelete");

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
            .get(SHARED_ELEMENTS.dataGridTable)
            .scrollIntoView();
          ensureCanvasStatic(SHARED_ELEMENTS.dataGridTable);
          // selects first row of subcategories
          cy.clickGridCell(0, 0);
          cy.get(CATEGORY_DETAILS_SELECTORS.deleteCategoriesButton)
            .click()
            .get(BUTTON_SELECTORS.submit)
            .click()
            .confirmationMessageShouldDisappear()
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
