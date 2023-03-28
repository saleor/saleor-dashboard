/// <reference types="cypress"/>
/// <reference types="../../support"/>

import {
  BUTTON_SELECTORS,
  HOMEPAGE_SELECTORS,
  SHARED_ELEMENTS,
} from "../../elements";
import { orderDraftCreateDemoResponse, urlList } from "../../fixtures";

describe("Dashboard demo site tests", () => {
  it("should be able to log in via UI", () => {
    //   { tags: ["@login", "@allEnv", "@stable", "@oldRelease"] },

    cy.addAliasToGraphRequest("Home")
      .visit(urlList.dashboard)
      .get(BUTTON_SELECTORS.submit)
      .should("be.visible")
      .click()
      .waitForRequestAndCheckIfNoErrors("@Home");
    cy.get(SHARED_ELEMENTS.notificationMessage).should("have.length", 1);
    cy.get(HOMEPAGE_SELECTORS.welcomeMessage).should("be.visible");
    cy.get(SHARED_ELEMENTS.notificationMessage).should("not.exist");
  });
  it("should not be able to create new order", () => {
    //   { tags: ["@login", "@allEnv", "@stable", "@oldRelease"] },

    cy.addAliasToGraphRequest("OrderList");
    cy.loginUserViaRequest().then(() => {
      cy.visit(`${urlList.dashboard}/orders`).waitForRequestAndCheckIfNoErrors(
        "@OrderList",
      );
      cy.pickAndSelectChannelOnCreateOrderFormByIndex(1);
      cy.addAliasToGraphRequest("OrderDraftCreate")
        .clickSubmitButton()
        .waitForRequestAndErrorMessage(
          "@OrderDraftCreate",
          orderDraftCreateDemoResponse,
        );
      cy.get(SHARED_ELEMENTS.notificationMessage).should("be.visible");
    });
  });
});
