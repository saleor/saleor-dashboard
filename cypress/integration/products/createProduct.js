// <reference types="cypress" />
import faker from "faker";

import { PRODUCT_DETAILS } from "../../elements/catalog/products/product-details";
import { PRODUCTS_LIST } from "../../elements/catalog/products/products-list";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { metadataForms } from "../../steps/catalog/metadataSteps";
import {
  fillUpPriceList,
  priceInputLists
} from "../../steps/catalog/products/priceList";
import { fillUpCommonFieldsForProductType } from "../../steps/catalog/products/productSteps";
import { selectChannelInDetailsPages } from "../../steps/channelsSteps";
import { urlList } from "../../url/urlList";
import {
  expectCorrectProductInformation,
  expectCorrectProductVariantInformation
} from "../../utils/products/checkProductInfo";
import * as productUtils from "../../utils/products/productsUtils";

describe("Create product", () => {
  const startsWith = "CyCreateProduct-";
  const name = `${startsWith}${faker.random.number()}`;
  const generalInfo = {
    name: `${startsWith}${faker.random.number()}`,
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
    productUtils.createAttribute(name).then(attributeResp => {
      attribute = attributeResp;
    });
  });
  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
    cy.visit(urlList.products)
      .get(PRODUCTS_LIST.createProductBtn)
      .click();
  });

  it("should create product with variants", () => {
    const randomName = `${startsWith}${faker.random.number()}`;
    productUtils.createTypeProduct(randomName, attribute.id);
    seo.slug = randomName;
    const productData = {
      generalInfo,
      seo,
      metadata,
      productOrganization: { productType: randomName },
      attribute
    };
    fillUpCommonFieldsForProductType(productData).then(
      productOrgResp => (productData.productOrganization = productOrgResp)
    );
    cy.addAliasToGraphRequest("ProductDetails");
    cy.get(BUTTON_SELECTORS.confirm).click();
    cy.wait("@ProductDetails");
    cy.get(PRODUCT_DETAILS.confirmationMsg).should("be.visible");
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
    const randomName = `${startsWith}${faker.random.number()}`;
    seo.slug = randomName;
    productUtils.createTypeProduct(randomName, attribute.id, false);
    const productData = {
      generalInfo,
      seo,
      metadata,
      productOrganization: { productType: randomName },
      attribute
    };
    fillUpCommonFieldsForProductType(productData).then(
      productOrgResp => (productData.productOrganization = productOrgResp)
    );
    selectChannelInDetailsPages();
    fillUpPriceList(prices.sellingPrice);
    fillUpPriceList(prices.costPrice, priceInputLists.costPrice);
    cy.get(PRODUCT_DETAILS.skuInput).type(randomName);
    cy.addAliasToGraphRequest("ProductDetails");
    cy.get(BUTTON_SELECTORS.confirm).click();
    cy.wait("@ProductDetails");
    cy.get(PRODUCT_DETAILS.confirmationMsg).should("be.visible");
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
});
