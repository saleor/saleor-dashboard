import { urlList } from "../../../url/urlList";
import { getDisplayedProductsArray } from "../../../utils/products/productsListUtils";

description("Sorting products", () => {
  before(() => {
    cy.clearSessionData()
      .loginUserViaRequest()
      .visit(urlList.products);
  });
  it("Sorting by name", () => {
    getDisplayedProductsArray().then(productsArray => {
      expectSortedBy(productsArray, "name");
    });
  });
});
