/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { PRODUCT_DETAILS } from "../../elements/catalog/products/product-details";
import { PRODUCTS_LIST } from "../../elements/catalog/products/products-list";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { urlList } from "../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../fixtures/users";
import { createAttribute } from "../../support/api/requests/Attribute";
import { createTypeProduct } from "../../support/api/requests/ProductType";
import {
  expectCorrectProductInformation,
  expectCorrectProductVariantInformation,
} from "../../support/api/utils/products/checkProductInfo";
import { metadataForms } from "../../support/pages/catalog/metadataComponent";
import {
  fillUpPriceList,
  priceInputLists,
} from "../../support/pages/catalog/products/priceListComponent";
import {
  fillUpCommonFieldsForAllProductTypes,
  fillUpProductTypeDialog,
} from "../../support/pages/catalog/products/productDetailsPage";
import { selectChannelInDetailsPages } from "../../support/pages/channelsPage";

describe("As an admin I should be able to create product", () => {
  const startsWith = "CyCreateProduct-";
  const name = `${startsWith}${faker.datatype.number()}`;
  const generalInfo = {
    name: `${startsWith}${faker.datatype.number()}`,
    description: faker.lorem.sentence(),
    rating: 2,
  };
  const seo = {
    title: "testTitle",
    description: generalInfo.description,
  };
  const metadata = {
    public: {
      metadataForm: metadataForms.public,
      name: "metadataName",
      value: "metadataValue",
    },
    private: {
      metadataForm: metadataForms.private,
      name: "privateMetadataName",
      value: "privateMetadataValue",
    },
  };
  let attribute;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    createAttribute({ name }).then(attributeResp => {
      attribute = attributeResp;
    });
  });
  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should be able to create product with variants as an admin. SALEOR_2701",
    { tags: ["@products", "@allEnv", "@critical", "@stable"] },
    () => {
      const randomName = `${startsWith}${faker.datatype.number()}`;
      seo.slug = randomName;
      const productData = {
        generalInfo,
        seo,
        metadata,
        productOrganization: { productType: randomName },
        attribute,
      };
      createTpeAndFillUpProductFields(randomName, true, productData).then(
        productOrgResp => (productData.productOrganization = productOrgResp),
      );
      cy.addAliasToGraphRequest("ProductDetails")
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear()
        .waitForRequestAndCheckIfNoErrors("@ProductDetails")
        .get("@ProductDetails")
        .its("response.body")
        .then(resp => {
          let productResp;
          if (Array.isArray(resp)) {
            productResp = resp.find(element => element.data.product).data
              .product;
          } else {
            productResp = resp.data.product;
          }
          expectCorrectProductInformation(productResp, productData);
        });
    },
  );

  it(
    "should be able to create product without variants as an admin. SALEOR_2702",
    { tags: ["@products", "@allEnv", "@critical", "@stable"] },
    () => {
      const prices = { sellingPrice: 6, costPrice: 3 };
      const randomName = `${startsWith}${faker.datatype.number()}`;
      seo.slug = randomName;
      const productData = {
        generalInfo,
        seo,
        metadata,
        productOrganization: { productType: randomName },
        attribute,
      };
      createTpeAndFillUpProductFields(randomName, false, productData).then(
        productOrgResp => (productData.productOrganization = productOrgResp),
      );
      selectChannelInDetailsPages();
      fillUpPriceList(prices.sellingPrice);
      fillUpPriceList(prices.costPrice, priceInputLists.costPrice);
      cy.get(PRODUCT_DETAILS.skuInput)
        .type(randomName)
        .addAliasToGraphRequest("ProductDetails")
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear()
        .wait("@ProductDetails")
        .get("@ProductDetails")
        .its("response.body")
        .then(resp => {
          let productResp;
          if (Array.isArray(resp)) {
            productResp = resp.find(element => element.data.product).data
              .product;
          } else {
            productResp = resp.data.product;
          }
          expectCorrectProductInformation(productResp, productData);
          expectCorrectProductVariantInformation(
            productResp.variants,
            randomName,
            prices,
          );
        });
    },
  );

  function createTpeAndFillUpProductFields(
    randomName,
    hasVariants,
    productData,
  ) {
    createTypeProduct({
      name: randomName,
      attributeId: attribute.id,
      hasVariants,
    });
    cy.clearSessionData()
      .loginUserViaRequest("auth", ONE_PERMISSION_USERS.product)
      .visit(urlList.products)
      .get(PRODUCTS_LIST.createProductBtn)
      .click();
    fillUpProductTypeDialog(productData);
    cy.get(BUTTON_SELECTORS.submit).click();
    return fillUpCommonFieldsForAllProductTypes(productData);
  }
});
