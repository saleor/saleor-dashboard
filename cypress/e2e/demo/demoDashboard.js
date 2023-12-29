/// <reference types="cypress"/>
/// <reference types="../../support"/>
import {
  BUTTON_SELECTORS,
  HOMEPAGE_SELECTORS,
  SHARED_ELEMENTS,
} from "../../elements";
import { orderDraftCreateDemoResponse, urlList } from "../../fixtures";
import { ordersOperationsHelpers } from "../../support/pages";

describe("Dashboard demo site tests", () => {
  it.skip("should be able to log in via UI", { tags: ["@demo-dashboard"] }, () => {
    cy.addAliasToGraphRequest("Home")
      .visit("/")
      .get(BUTTON_SELECTORS.submit)
      .should("be.visible")
      .click()
      .waitForRequestAndCheckIfNoErrors("@Home");
    cy.get(SHARED_ELEMENTS.notificationMessage).should("have.length", 1);
    cy.get(HOMEPAGE_SELECTORS.welcomeMessage).should("be.visible");
    cy.get(SHARED_ELEMENTS.notificationMessage).should("not.exist");
  });
  it.skip(
    "should not be able to create new order",
    { tags: ["@demo-dashboard"] },
    () => {
      cy.addAliasToGraphRequest("OrderList");
      cy.loginUserViaRequest().then(() => {
        cy.visit(`${urlList.orders}`).waitForRequestAndCheckIfNoErrors(
          "@OrderList",
        );
        ordersOperationsHelpers.pickAndSelectChannelOnCreateOrderFormByIndex(1);
        cy.addAliasToGraphRequest("OrderDraftCreate")
          .clickSubmitButton()
          .waitForRequestAndErrorMessage(
            "@OrderDraftCreate",
            orderDraftCreateDemoResponse,
          );
        cy.get(SHARED_ELEMENTS.notificationMessage).should("exist");
      });
    },
  );
});
