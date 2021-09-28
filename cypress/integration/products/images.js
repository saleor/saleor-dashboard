/// <reference types="cypress"/>
/// <reference types="../../support"/>

import { urlList } from "../../fixtures/urlList";
import filterTests from "../../support/filterTests";

filterTests({ definedTags: ["all"] }, () => {
  describe("Tests for images", () => {
    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
    });

    it("All requests with image content type should have correct status response", () => {
      const imageUrl = `${urlList.apiUri.replace("graphql", "media")}**`;
      cy.intercept({
        url: imageUrl,
        headers: { "content-type": "image/png" }
      }).as("imageRequest");
      cy.addAliasToGraphRequest("ProductList")
        .visit(urlList.products)
        .wait("@ProductList")
        .its("response.body")
        .then(resp => {
          const data = resp.find(element =>
            element.data.hasOwnProperty("products")
          ).data;
          const products = data.products.edges;
          products.forEach(() => {
            cy.wait("@imageRequest");
          });
        });
    });

    // xit("Should display product image", () => {

    // });

    // xit("should upload image", () => {

    // })
  });
});
