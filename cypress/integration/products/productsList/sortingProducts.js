import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import { waitForProgressBarToNotExist } from "../../../steps/shared/progressBar";
import filterTests from "../../../support/filterTests";
import { urlList } from "../../../url/urlList";
import { expectProductsSortedBy } from "../../../utils/products/productsListUtils";

filterTests(["all"], () => {
  describe("Sorting products", () => {
    const sortByList = ["name", "type"];
    sortByList.forEach(sortBy => {
      it(`Sorting by ${sortBy}`, () => {
        cy.clearSessionData()
          .loginUserViaRequest()
          .visit(urlList.products);
        cy.softExpectSkeletonIsVisible();
        cy.get(SHARED_ELEMENTS.header).should("be.visible");
        if (sortBy !== "name") {
          cy.get(PRODUCTS_LIST.tableHeaders[sortBy]).click();
          waitForProgressBarToNotExist();
        }
        expectProductsSortedBy(sortBy);
        cy.addAliasToGraphRequest("ProductList")
          .get(PRODUCTS_LIST.tableHeaders[sortBy])
          .click();
        waitForProgressBarToNotExist().wait("@ProductList");
        expectProductsSortedBy(sortBy, false);
      });
    });
  });
});
