import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import { urlList } from "../../../url/urlList";
import { expectProductsSortedBy } from "../../../utils/products/productsListUtils";

describe("Sorting products", () => {
  const sortByList = ["name", "type", "availability", "price"];
  sortByList.forEach(sortBy => {
    it(`Sorting by ${sortBy}`, () => {
      cy.clearSessionData()
        .loginUserViaRequest()
        .visit(urlList.products);
      cy.addAliasToGraphRequest("ProductList");
      if (sortBy !== "name") {
        cy.get(PRODUCTS_LIST.tableHeaders[sortBy]).click();
        cy.wait("@ProductList");
        cy.get(SHARED_ELEMENTS.progressBar).should("not.exist");
      }
      expectProductsSortedBy(sortBy);
      cy.get(PRODUCTS_LIST.tableHeaders[sortBy]).click();
      cy.wait("@ProductList");
      cy.get(SHARED_ELEMENTS.progressBar).should("not.exist");
      expectProductsSortedBy(sortBy, false);
    });
  });
});
