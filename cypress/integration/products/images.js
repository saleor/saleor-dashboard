/// <reference types="cypress"/>
/// <reference types="../../support"/>

import { PRODUCT_DETAILS } from "../../elements/catalog/products/product-details";
import { PRODUCTS_LIST } from "../../elements/catalog/products/products-list";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { demoProductsNames } from "../../fixtures/products";
import { productDetailsUrl, urlList } from "../../fixtures/urlList";
import { getFirstProducts } from "../../support/api/requests/Product";
import filterTests from "../../support/filterTests";

filterTests({ definedTags: ["all"] }, () => {
  describe("Tests for images", () => {
    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
    });

    it("Images on product list should be displayed", () => {
      cy.addAliasToGraphRequest("ProductList")
        .visit(urlList.products)
        .wait("@ProductList")
        .its("response.body")
        .then(resp => {
          const data = resp.find(element =>
            element.data.hasOwnProperty("products")
          ).data;
          const products = data.products.edges;
          cy.get(PRODUCTS_LIST.productImage)
            .each($image => {
              cy.wrap($image)
                .invoke("attr", "src")
                .then(imageUrl => {
                  cy.request(imageUrl);
                })
                .then(respImage => {
                  expect(respImage.status).to.eq(200);
                });
            })
            .then(images => {
              const expectedProductsSvgAvatars =
                products.length - images.length;
              cy.get(PRODUCTS_LIST.tableCellAvatar)
                .find(SHARED_ELEMENTS.svgImage)
                .should("have.length", expectedProductsSvgAvatars);
            });
        });
    });

    it("Should display product image", () => {
      getFirstProducts(1, demoProductsNames.appleJuice)
        .then(resp => {
          const product = resp[0].node;
          cy.visit(productDetailsUrl(product.id))
            .get(PRODUCT_DETAILS.productImage)
            .find("img")
            .invoke("attr", "src");
        })
        .then(imageUrl => {
          cy.request(imageUrl);
        })
        .then(imageResp => {
          expect(imageResp.status).to.equal(200);
        });
    });

    // xit("should upload image", () => {

    // })
  });
});
