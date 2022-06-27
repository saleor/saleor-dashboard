/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { urlList } from "../../../fixtures/urlList";
import { getProductType } from "../../../support/api/requests/ProductType";
import { deleteProductsStartsWith } from "../../../support/api/utils/products/productsUtils";
import { createProductType } from "../../../support/pages/productTypePage";

describe("As an admin I want to create product types", () => {
  const startsWith = "productType";

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteProductsStartsWith(startsWith);
  });

  beforeEach(() => {
    cy.clearSessionData()
      .loginUserViaRequest()
      .visit(urlList.productTypes)
      .expectSkeletonIsVisible();
  });

  it(
    "should be able to create product type without shipping required. TC: SALEOR_1501",
    { tags: ["@productType", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;

      createProductType({ name })
        .then(productType => {
          getProductType(productType.id);
        })
        .then(productType => {
          expect(productType.name).to.be.eq(name);
          expect(productType.isShippingRequired).to.be.false;
          expect(productType.kind).to.be.eq("NORMAL");
        });
    },
  );

  it(
    "should be able to create product type with shipping required. TC: SALEOR_1502",
    { tags: ["@productType", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const shippingWeight = 10;

      createProductType({ name, shippingWeight })
        .then(productType => {
          getProductType(productType.id);
        })
        .then(productType => {
          expect(productType.name).to.be.eq(name);
          expect(productType.isShippingRequired).to.be.true;
          expect(productType.weight.value).to.eq(shippingWeight);
          expect(productType.kind).to.be.eq("NORMAL");
        });
    },
  );

  it(
    "should be able to create product type with gift card kind. TC: SALEOR_1510",
    { tags: ["@productType", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;

      createProductType({ name, giftCard: true })
        .then(productType => {
          getProductType(productType.id);
        })
        .then(productType => {
          expect(productType.name).to.be.eq(name);
          expect(productType.isShippingRequired).to.be.false;
          expect(productType.kind).to.be.eq("GIFT_CARD");
        });
    },
  );
});
