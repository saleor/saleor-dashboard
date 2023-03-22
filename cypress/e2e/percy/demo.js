/// <reference types="cypress"/>
/// <reference types="../../support"/>

import { BUTTON_SELECTORS } from "../../elements";
import { bodyMockHomePage } from "../../fixtures";
import { urlList } from "../../fixtures/urlList";

describe("Demo staging", () => {
  it("should visual check login demo page", () => {
    //   { tags: ["@login", "@allEnv", "@stable", "@oldRelease"] },
    cy.visit(urlList.dashboard);
    cy.get(BUTTON_SELECTORS.submit).should("be.visible");
    cy.percySnapshot("Demo login page");
  });
  it("should log in via UI and visual check home demo page", () => {
    //   { tags: ["@login", "@allEnv", "@stable", "@oldRelease"] },
    cy.addAliasToGraphRequestAndUseMockedResponseBody("Home", bodyMockHomePage);
    cy.visit(urlList.dashboard).get(BUTTON_SELECTORS.submit).click();
    cy.waitForRequestAndCheckIfNoErrors("@Home");
    cy.percySnapshot("Demo home page");
  });
});
