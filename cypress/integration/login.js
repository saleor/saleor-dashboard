/// <reference types="cypress"/>
/// <reference types="../support"/>

import { LOGIN_SELECTORS } from "../elements/account/login-selectors";
import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";
import { urlList } from "../fixtures/urlList";
import { USER_WITHOUT_NAME } from "../fixtures/users";
import { getMailActivationLinkForUser } from "../support/api/utils/users";
import filterTests from "../support/filterTests";

filterTests({ definedTags: ["all"] }, () => {
  describe("User authorization", () => {
    beforeEach(() => {
      cy.clearSessionData();
    });

    xit("should successfully log in an user", () => {
      cy.visit(urlList.homePage);
      cy.loginUser();
      cy.get(LOGIN_SELECTORS.welcomePage).should("be.visible");
    });

    xit("should fail for wrong password", () => {
      cy.visit(urlList.homePage)
        .get(LOGIN_SELECTORS.emailAddressInput)
        .type("admin@example.com")
        .get(LOGIN_SELECTORS.emailPasswordInput)
        .type("wrong-password")
        .get(LOGIN_SELECTORS.signInButton)
        .click()
        .get(LOGIN_SELECTORS.warningCredentialMessage)
        .should("be.visible");
    });

    xit("should successfully log out an user", () => {
      cy.clearSessionData()
        .loginUserViaRequest()
        .visit(urlList.homePage)
        .get(LOGIN_SELECTORS.userMenu)
        .click()
        .get(LOGIN_SELECTORS.logOutButton)
        .click()
        .get(LOGIN_SELECTORS.emailAddressInput)
        .should("be.visible");
    });
  });
});
