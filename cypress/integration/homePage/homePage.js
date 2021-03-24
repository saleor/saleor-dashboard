import { TEST_ADMIN_USER, USER_WITHOUT_NAME } from "../../Data/users";
import { HOMEPAGE_SELECTORS } from "../../elements/homePage/homePage-selectors";
import { urlList } from "../../url/urlList";

describe("Displaying welcome message on home page", () => {
  it("should display user name on home page", () => {
    cy.loginUserViaRequest();
    cy.visit(urlList.homePage);
    cy.get(HOMEPAGE_SELECTORS.welcomeMessage)
      .invoke("text")
      .then(text => {
        expect(text).to.contains(
          `${TEST_ADMIN_USER.name} ${TEST_ADMIN_USER.lastName}`
        );
      });
  });

  it("should display user email on home page", () => {
    cy.loginUserViaRequest("auth", USER_WITHOUT_NAME);
    cy.visit(urlList.homePage);
    cy.get(HOMEPAGE_SELECTORS.welcomeMessage)
      .invoke("text")
      .then(text => {
        expect(text).to.contains(`${USER_WITHOUT_NAME.email}`);
      });
  });
});
