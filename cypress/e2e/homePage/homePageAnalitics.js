/// <reference types="cypress"/>
/// <reference types="../../support"/>

import { HOMEPAGE_SELECTORS } from "../../elements/homePage/homePage-selectors";
import { urlList } from "../../fixtures/urlList";

describe("As an admin I want to see correct information on dashboard home page", () => {
  const startsWith = "CyHomeAnalytics";

  before(() => {
    cy.loginUserViaRequest();
  });

  it(
    "should display correct information on dashboard home page. SALEOR_2004 - migration in progress - to delete when done",
    { tags: ["@homePage", "@allEnv", "@critical"] },
    () => {
      cy.visit(urlList.homePage);
      cy.get(HOMEPAGE_SELECTORS.activity).should("be.visible");
      cy.get(HOMEPAGE_SELECTORS.activity)
        .find("ul")
        .find("li")
        .should("have.length.above", 1);
      cy.get(HOMEPAGE_SELECTORS.sales).should("be.visible");
      cy.get(HOMEPAGE_SELECTORS.productsOutOfStock).should("be.visible");

      cy.get(HOMEPAGE_SELECTORS.topProducts).should("be.visible");
    },
  );
});
