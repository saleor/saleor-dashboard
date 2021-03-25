// <reference types="cypress" />
import faker from "faker";

import { PRODUCT_DETAILS } from "../../elements/catalog/products/product-details";
import { PRODUCTS_LIST } from "../../elements/catalog/products/products-list";
import { metadataForms } from "../../steps/catalog/metadataSteps";
import {
  fillUpPriceList,
  priceInputLists
} from "../../steps/catalog/products/priceList";
import { fillUpCommonFieldsForProductType } from "../../steps/catalog/products/productSteps";
import { selectChannelInDetailsPages } from "../../steps/channelsSteps";
import { urlList } from "../../url/urlList";
import * as productUtils from "../../utils/productsUtils";

describe("Create product", () => {
  const startsWith = "Cy-";
  const name = `${startsWith}${faker.random.number()}`;
  const generalInfo = {
    name: `${startsWith}${faker.random.number()}`,
    description: faker.lorem.sentence(),
    rating: 2
  };
  const seo = {
    slug: "testSlug",
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
  const { softExpect } = chai;
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

  it("should create product, with product type using variant attributes", () => {
    const productTypeName = `${startsWith}${faker.random.number()}`;
    productUtils.createTypeProduct(productTypeName, attribute.id, true);
    fillUpCommonFieldsForProductType({
      generalInfo,
      seo,
      metadata,
      productOrganization: { productType: productTypeName }
    }).then(
      productOrgResp => (productData.productOrganization = productOrgResp)
    );
    cy.addAliasToGraphRequest("ProductDetails");
    cy.get(PRODUCT_DETAILS.saveBtn).click();
    cy.wait("@ProductDetails");
    cy.get(PRODUCT_DETAILS.confirmationMsg).should("be.visible");
    cy.get("@ProductDetails")
      .its("response.body")
      .then(resp => {
        const productResp = resp.find(element => element.data.product).data
          .product;
        expectCorrectProductInformation(productResp);
        expectCorrectProductOrganization(productResp, {
          category: productOrganization.category,
          collection: productOrganization.collection,
          productType: productTypeName
        });
      });
  });
  it("should create product", () => {
    const prices = { sellingPrice: 6, costPrice: 3 };
    const randomName = `${startsWith}${faker.random.number()}`;
    productUtils.createTypeProduct(randomName, attribute.id);
    const productData = {
      generalInfo,
      seo,
      metadata,
      productOrganization: { productType: randomName }
    };
    fillUpCommonFieldsForProductType(productData).then(
      productOrgResp => (productData.productOrganization = productOrgResp)
    );
    selectChannelInDetailsPages();
    fillUpPriceList(prices.sellingPrice);
    fillUpPriceList(prices.costPrice, priceInputLists.costPrice);
    cy.get(PRODUCT_DETAILS.skuInput).type(randomName);
    cy.addAliasToGraphRequest("ProductDetails");
    cy.get(PRODUCT_DETAILS.saveBtn).click();
    cy.wait("@ProductDetails");
    cy.get(PRODUCT_DETAILS.confirmationMsg).should("be.visible");
    cy.get("@ProductDetails")
      .its("response.body")
      .then(resp => {
        const productResp = resp.find(element => element.data.product).data
          .product;
        expectCorrectProductInformation(productResp, productData);
        softExpect(
          expect(productResp.variants).to.have.length(1),
          softExpect(productResp.variants[0].sku).to.be.eq(randomName),
          softExpect(
            productResp.variants[0].channelListings[0].costPrice.amount
          ).to.be.eq(prices.costPrice),
          softExpect(
            productResp.variants[0].channelListings[0].price.amount
          ).to.be.eq(prices.sellingPrice)
        );
      });
  });

  function expectCorrectProductInformation(productResp, productData) {
    softExpect(productResp.name).to.be.eq(productData.generalInfo.name);
    softExpect(productResp.description).includes(
      productData.generalInfo.description
    );
    softExpect(productResp.rating).to.be.eq(productData.generalInfo.rating);
    softExpect(productResp.slug).to.be.eq(productData.seo.slug);
    softExpect(productResp.seoTitle).to.be.eq(productData.seo.title);
    softExpect(productResp.seoDescription).to.be.eq(
      productData.seo.description
    );
    softExpect(
      expect(productResp.metadata).to.have.length(1),
      softExpect(productResp.metadata[0].key).to.be.eq(
        productData.metadata.public.name
      ),
      softExpect(productResp.metadata[0].value).to.be.eq(
        productData.metadata.public.value
      )
    );
    softExpect(
      expect(productResp.privateMetadata).to.have.length(1),
      softExpect(productResp.privateMetadata[0].key).to.be.eq(
        productData.metadata.private.name
      ),
      softExpect(productResp.privateMetadata[0].value).to.be.eq(
        productData.metadata.private.value
      )
    );
    softExpect(productResp.productType.name).to.be.eq(
      productData.productOrganization.productType
    );
    softExpect(productResp.category.name).to.be.eq(
      productData.productOrganization.category
    );
    softExpect(
      expect(productResp.attributes).to.have.length(1),
      softExpect(productResp.attributes[0].attribute.name).to.be.eq(
        attribute.name
      )
    );
    softExpect(
      expect(productResp.collections).to.have.length(1),
      softExpect(productResp.collections[0].name).to.be.eq(
        productData.productOrganization.collection
      )
    );
  }
});
