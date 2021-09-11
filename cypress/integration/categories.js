// <reference types="cypress" />
import faker from "faker";

import { getCategory } from "../apiRequests/Category";
import { CATEGORIES_LIST } from "../elements/catalog/categories/categories-list";
import { CATEGORY_DETAILS } from "../elements/catalog/categories/category-details";
import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../elements/shared/sharedElements";
import { createCategory } from "../steps/categoriesSteps";
import { confirmationMessageShouldDisappear } from "../steps/shared/confirmationMessages";
import filterTests from "../support/filterTests";
import { categoryDetailsUrl, urlList } from "../url/urlList";
import { deleteCategoriesStartsWith } from "../utils/categoryUtils";
import * as channelsUtils from "../utils/channelsUtils";
import * as productsUtils from "../utils/products/productsUtils";
import { deleteShippingStartsWith } from "../utils/shippingUtils";

filterTests(["all"], () => {
  describe("Categories", () => {
    const startsWith = "CyCollections";
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
          productsUtils.createTypeAttributeAndCategoryForProduct(name);
        })
        .then(
          ({
            category: categoryResp,
            attribute: attributeResp,
            productType: productTypeResp
          }) => {
            category = categoryResp;
            attribute = attributeResp;
            productType = productTypeResp;
            productsUtils.createProductInChannel({
              name,
              channelId: defaultChannel.id,
              productTypeId: productType.id,
              attributeId: attribute.id,
              categoryId: category.id
            });
          }
        )
        .then(({ product: productResp }) => (product = productResp));
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
    });

    it("should create category", () => {
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
          // Uncomment this expect after fixing bug SALEOR-3728
          // expect(newCategory.description).to.eq(categoryName);
        });
    });

    it("should add subcategory", () => {
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
    });

    it("should add product to category", () => {
      cy.visit(categoryDetailsUrl(category.id))
        .get(CATEGORY_DETAILS.productsTab)
        .click()
        .get(CATEGORY_DETAILS.addProducts)
        .click()
        .url()
        .should("include", urlList.addProduct);
    });

    it("should remove product from category", () => {
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
        .click();
      confirmationMessageShouldDisappear();
      cy.contains(CATEGORY_DETAILS.productRow, product.name)
        .should("not.exist")
        .wait("@productBulkDelete");
      getCategory(category.id).then(categoryResp => {
        expect(categoryResp.products.edges.length).to.be.eq(0);
      });
    });

    it("should enter category details page", () => {
      cy.visit(urlList.categories)
        .get(SHARED_ELEMENTS.searchInput)
        .type(category.name);
      cy.contains(SHARED_ELEMENTS.tableRow, category.name).click();
      cy.contains(SHARED_ELEMENTS.header, category.name).should("be.visible");
    });
  });
});
