import { PERMISSION_USERS } from "../data/users";
import { LEFT_MENU_SELECTORS } from "../elements/account/left-menu/left-menu-selectors";
import { CONFIGURATION_SELECTORS } from "../elements/configuration/configuration-selectors";
import { SHARED_ELEMENTS } from "../elements/shared/sharedElements";
import { urlList } from "../url/urlList";

describe("Navigation in dashboard", () => {
  it("should shipping page be enabled", () => {
    const user = {
      email: PERMISSION_USERS.emails.shipping,
      password: PERMISSION_USERS.password
    };

    loginUserViaRequest("auth", user);

    cy.get(LEFT_MENU_SELECTORS.configuration)
      .click()
      .get(CONFIGURATION_SELECTORS.shipping)
      .click()
      .get(SHARED_ELEMENTS.pageHeader)
      .should("be.visible");

    LEFT_MENU_SELECTORS.array.forEach(element => {
      if (element !== LEFT_MENU_SELECTORS.configuration) {
        cy.get("body")
          .find(element)
          .should("not.exist");
      }
    });
    cy.visit(urlList.channels)
      .get(SHARED_ELEMENTS.pageHeader)
      .should("not.exist");
  });
});
