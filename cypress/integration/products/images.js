/// <reference types="cypress"/>
/// <reference types="../../support"/>

import { PRODUCT_DETAILS } from "../../elements/catalog/products/product-details";
import { PRODUCTS_LIST } from "../../elements/catalog/products/products-list";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { demoProductsNames } from "../../fixtures/products";
import { productDetailsUrl, urlList } from "../../fixtures/urlList";
import { getFirstProducts } from "../../support/api/requests/Product";
import { deleteProductsAndCreateNewOneWithNewDataAndDefaultChannel } from "../../support/api/utils/products/productsUtils";
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
          cy.softExpectSkeletonIsVisible()
            .get(SHARED_ELEMENTS.skeleton)
            .should("not.exist");
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
      getFirstProducts(1, demoProductsNames.carrotJuice)
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

    it("Should upload saved image", () => {
      const name = "CyImages";

      cy.clearSessionData().loginUserViaRequest();
      deleteProductsAndCreateNewOneWithNewDataAndDefaultChannel({ name })
        .then(({ product }) => {
          cy.visit(productDetailsUrl(product.id))
            .waitForProgressBarToNotBeVisible()
            .get(PRODUCT_DETAILS.uploadImageButton)
            .click()
            .get(PRODUCT_DETAILS.uploadSavedImagesButton)
            .click()
            .get(SHARED_ELEMENTS.fileInput)
            .attachFile("images/saleorDemoProductSneakers.png")
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
  });
});
