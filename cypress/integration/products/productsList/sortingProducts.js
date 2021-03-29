import get from "lodash.get";

import { PRODUCTS_SELECTORS } from "../../../elements/catalog/products/product-selectors";
import { urlList } from "../../../url/urlList";

description("Sorting products", () => {
  before(() => {
    cy.clearSessionData()
      .loginUserViaRequest()
      .visit(urlList.products);
  });
  it("Sorting by name", () => {
    get(PRODUCTS_SELECTORS.products).each($product => {
      $product.find();
    });
  });
});
