// <reference types="cypress" />
import faker from "faker";

import { createAttribute } from "../../../apiRequests/Attribute";
import { createTypeProduct } from "../../../apiRequests/productType";
import { ONE_PERMISSION_USERS } from "../../../Data/users";
import { PRODUCT_DETAILS } from "../../../elements/catalog/products/product-details";
import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import { metadataForms } from "../../../steps/catalog/metadataSteps";
import {
  fillUpPriceList,
  priceInputLists
} from "../../../steps/catalog/products/priceList";
import { fillUpCommonFieldsForAllProductTypes } from "../../../steps/catalog/products/productSteps";
import { selectChannelInDetailsPages } from "../../../steps/channelsSteps";
import { urlList } from "../../../url/urlList";
import {
  expectCorrectProductInformation,
  expectCorrectProductVariantInformation
} from "../../../utils/products/checkProductInfo";
import * as productUtils from "../../../utils/products/productsUtils";

describe("Create product", () => {
  const startsWith = "CyCreateProduct-";
  const name = `${startsWith}${faker.datatype.number()}`;
  const generalInfo = {
    name: `${startsWith}${faker.datatype.number()}`,
    description: faker.lorem.sentence(),
    rating: 2
  };
  const seo = {
    title: "testTitle",
    description: generalInfo.description
  };
  const metadata = {
    public: {
      metadataForm: metadataForms.public,
      name: "metadataName",
      value: "metadataValue"
    },
    private: {
      metadataForm: metadataForms.private,
      name: "privateMetadataName",
      value: "privateMetadataValue"
    }
  };
  let attribute;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    productUtils.deleteProductsStartsWith(startsWith);
    createAttribute(name).then(attributeResp => {
      attribute = attributeResp;
    });
  });
  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should create product with variants", () => {
    const randomName = `${startsWith}${faker.datatype.number()}`;
    seo.slug = randomName;
    const productData = {
      generalInfo,
      seo,
      metadata,
      productOrganization: { productType: randomName },
      attribute
    };
    createTpeAndFillUpProductFields(randomName, true, productData).then(
      productOrgResp => (productData.productOrganization = productOrgResp)
    );
    cy.addAliasToGraphRequest("ProductDetails");
    cy.get(BUTTON_SELECTORS.confirm).click();
    cy.wait("@ProductDetails");
    cy.get(SHARED_ELEMENTS.confirmationMsg).should("be.visible");
    cy.get("@ProductDetails")
      .its("response.body")
      .then(resp => {
        const productResp = resp.find(element => element.data.product).data
          .product;
        expectCorrectProductInformation(productResp, productData);
      });
  });

  it("should create product without variants", () => {
    const prices = { sellingPrice: 6, costPrice: 3 };
    const randomName = `${startsWith}${faker.datatype.number()}`;
    seo.slug = randomName;
    const productData = {
      generalInfo,
      seo,
      metadata,
      productOrganization: { productType: randomName },
      attribute
    };
    createTpeAndFillUpProductFields(randomName, false, productData).then(
      productOrgResp => (productData.productOrganization = productOrgResp)
    );
    selectChannelInDetailsPages();
    fillUpPriceList(prices.sellingPrice);
    fillUpPriceList(prices.costPrice, priceInputLists.costPrice);
    cy.get(PRODUCT_DETAILS.skuInput).type(randomName);
    cy.addAliasToGraphRequest("ProductDetails");
    cy.get(BUTTON_SELECTORS.confirm).click();
    cy.wait("@ProductDetails");
    cy.get(SHARED_ELEMENTS.confirmationMsg).should("be.visible");
    cy.get("@ProductDetails")
      .its("response.body")
      .then(resp => {
        const productResp = resp.find(element => element.data.product).data
          .product;
        expectCorrectProductInformation(productResp, productData);
        expectCorrectProductVariantInformation(
          productResp.variants,
          randomName,
          prices
        );
      });
  });

  function createTpeAndFillUpProductFields(
    randomName,
    hasVariants,
    productData
  ) {
    createTypeProduct({
      name: randomName,
      attributeId: attribute.id,
      hasVariants
    });
    cy.clearSessionData()
      .loginUserViaRequest("auth", ONE_PERMISSION_USERS.product)
      .visit(urlList.products)
      .get(PRODUCTS_LIST.createProductBtn)
      .click();
    return fillUpCommonFieldsForAllProductTypes(productData);
  }
});
