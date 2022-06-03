/// <reference types="cypress"/>
/// <reference types="../../support"/>

import { urlList } from "../../fixtures/urlList";
import { TEST_ADMIN_USER, USER_WITHOUT_NAME } from "../../fixtures/users";
import filterTests from "../../support/filterTests";
import { expectWelcomeMessageIncludes } from "../../support/pages/homePage";

filterTests({ definedTags: ["all"] }, () => {
  describe("Displaying welcome message on home page", () => {
    it("should display user name on home page", () => {
      cy.loginUserViaRequest().visit(urlList.homePage);
      expectWelcomeMessageIncludes(
        `${TEST_ADMIN_USER.name} ${TEST_ADMIN_USER.lastName}`
      );
    });

    it("should display user email on home page", () => {
      cy.loginUserViaRequest("auth", USER_WITHOUT_NAME).visit(urlList.homePage);
      expectWelcomeMessageIncludes(`${USER_WITHOUT_NAME.email}`);
    });

    it("should refresh page without errors", () => {
      cy.loginUserViaRequest()
        .visit(urlList.homePage)
        .waitForProgressBarToNotExist()
        .reload(true);
      expectWelcomeMessageIncludes(
        `${TEST_ADMIN_USER.name} ${TEST_ADMIN_USER.lastName}`
      );
    });
  });
});
