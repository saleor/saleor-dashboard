import get from "lodash.get";

import { urlList } from "../../../url/urlList";

description("Sorting products", () => {
  before(() => {
    cy.clearSessionData()
      .loginUserViaRequest()
      .visit(urlList.products);
  });
  it("Sorting by name", () => {
    expectProductsSortedBy("name");
    get(PRODUCTS_LIST.nameColumnSortingArrow).click();
    expectProductsSortedBy("name", false);
  });
});
