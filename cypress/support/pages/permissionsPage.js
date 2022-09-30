import { LEFT_MENU_SELECTORS } from "../../elements/account/left-menu/left-menu-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { urlList } from "../../fixtures/urlList";

export function navigateToAllAvailablePageAndCheckIfDisplayed({
  user,
  permissions,
}) {
  cy.loginUserViaRequest("auth", user).visit(urlList.homePage);
  if (!permissions) {
    return;
  }
  return permissions.forEach(permission =>
    permission.permissionSelectors.forEach(permissionSelector => {
      if (permission.parent) {
        cy.get(permission.parent.parentMenuSelector).click();
      }
      return cy
        .get(permissionSelector)
        .click()
        .then(() => {
          isElementDisplayed().should("be.true");
        });
    }),
  );
}

export function isElementDisplayed(element = SHARED_ELEMENTS.header) {
  return cy.get("body").then(body => body.find(element).length > 0);
}

export function getDisplayedSelectors(selectors = LEFT_MENU_SELECTORS) {
  const displayedSelectors = {};

  cy.wrap(displayedSelectors).as("displayedSelectors");

  Object.values(selectors).forEach((value, i) =>
    isElementDisplayed(value).then(isDisplayed => {
      if (isDisplayed) {
        cy.wrap(value);

        displayedSelectors["link" + i] = value;

        cy.wrap(displayedSelectors).as("displayedSelectors");
      }
    }),
  );
  return cy.get("@displayedSelectors");
}

export function expectAllSelectorsPermitted(permissions, selectors) {
  Object.values(selectors).forEach(selector => {
    const isSelectorPermitted = isPermitted(permissions, selector);

    expect(isSelectorPermitted, `${selector} selector should be in permitted`)
      .to.be.true;
  });
}

function isPermitted(permissions, selector) {
  let permittedSelectors = [LEFT_MENU_SELECTORS.home];

  permissions.forEach(permission => {
    if (permission.parent) {
      permittedSelectors.push(permission.parent.parentMenuSelector);
    }
    permittedSelectors = permittedSelectors.concat(
      permission.permissionSelectors,
    );
  });
  return permittedSelectors.includes(selector);
}
