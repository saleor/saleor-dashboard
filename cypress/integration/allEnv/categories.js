// <reference types="cypress" />
import faker from "faker";

import { CATEGORIES_LIST } from "../../elements/catalog/categories/categories-list";
import { CATEGORY_DETAILS } from "../../elements/catalog/categories/category-details";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { confirmationMessageShouldDisappear } from "../../steps/shared/confirmationMessages";
import { urlList } from "../../url/urlList";
import { deleteCategoriesStartsWith } from "../../utils/categoryUtils";
import * as channelsUtils from "../../utils/channelsUtils";
import * as productsUtils from "../../utils/products/productsUtils";
import { deleteShippingStartsWith } from "../../utils/shippingUtils";

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
            attributeId: attribute.id
          });
        }
      )
      .then(({ product: productResp }) => (product = productResp));
  });

  beforeEach(() => {
    cy.clearSessionData()
      .loginUserViaRequest()
      .visit(urlList.categories);
  });

  it("should create category", () => {
    const categoryName = `${startsWith}${faker.datatype.number()}`;

    cy.get(CATEGORIES_LIST.addCategoryButton)
      .click()
      .get(CATEGORY_DETAILS.nameInput)
      .type(categoryName)
      .get(CATEGORY_DETAILS.descriptionInput)
      .type(categoryName)
      .addAliasToGraphRequest("CategoryCreate")
      .get(BUTTON_SELECTORS.confirm)
      .click()
      .get(SHARED);
    confirmationMessageShouldDisappear();
    cy.wait("@CategoryCreate")
      .its("response.body.data.categoryCreate.category")
      .then(newCategory => {
        getCategory(newCategory.id);
      })
      .then(newCategory => {
        expect(newCategory.name).to.eq(name);
        expect(newCategory.description).to.eq(name);
      });
  });

  // it("should add subcategory", () => {

  // });

  // it("should add product to category", () => {

  // });

  // it("should remove product from category", () => {

  // });
});
