import { LEFT_MENU_SELECTORS } from "../elements/account/left-menu/left-menu-selectors";
import { SHARED_ELEMENTS } from "../elements/shared/sharedElements";
import { urlList } from "../url/urlList";

export function navigateToAvailablePageAsOnePermissionUser({
  user,
  parent,
  pageMenuSelector
}) {
  cy.loginUserViaRequest("auth", user);
  cy.visit(urlList.homePage);
  if (parent) {
    cy.get(parent.parentMenuSelector).click();
  }
  cy.get(pageMenuSelector).click();
}
export function isElementDisplayed(element = SHARED_ELEMENTS.table) {
  return cy.get("body").then(body => body.find(element).length > 0);
}
export function getNotPermittedLinks({ parent, pageMenuSelector }) {
  const permittedMenuSelector = parent
    ? parent.parentMenuSelector
    : pageMenuSelector;
  const notPermittedLinkInMenu = Object.values(LEFT_MENU_SELECTORS).find(
    value =>
      isElementDisplayed(value) ||
      value !== (permittedMenuSelector || LEFT_MENU_SELECTORS.home)
  );
  const notPermittedLinkInParent = parent
    ? Object.values(parent.parentSelectors).find(
        value => value !== pageMenuSelector || isElementDisplayed()
      )
    : null;
  return { notPermittedLinkInMenu, notPermittedLinkInParent };
}
