import { MENU_DETAILS } from "../elements/navigation/menu-details";
import { MENU_LIST } from "../elements/navigation/menu-list";
import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../elements/shared/sharedElements";
import { menuDetailsUrl, urlList } from "../url/urlList";
import { confirmationMessageShouldDisappear } from "./shared/confirmationMessages";

export function createMenu(name) {
  cy.visit(urlList.navigation)
    .get(MENU_LIST.addMenuButton)
    .click()
    .get(MENU_LIST.createMenuForm.nameInput)
    .type(name)
    .addAliasToGraphRequest("MenuCreate")
    .get(BUTTON_SELECTORS.submit)
    .click();
  confirmationMessageShouldDisappear();
  return cy.wait("@MenuCreate").its("response.body.data.menuCreate.menu");
}

export function createNewMenuItem({ menuId, name, menuItemType }) {
  let selectedItem;

  return cy
    .visit(menuDetailsUrl(menuId))
    .get(MENU_DETAILS.createNewMenuItemButton)
    .click()
    .get(SHARED_ELEMENTS.dialog)
    .find(MENU_DETAILS.newMenuItemForm.nameInput)
    .type(name)
    .get(MENU_DETAILS.newMenuItemForm.autocompleteSelectReference)
    .click()
    .get(SHARED_ELEMENTS.progressBar)
    .should("be.not.visible")
    .get(MENU_DETAILS.newMenuItemForm[menuItemType])
    .click()
    .get(MENU_DETAILS.newMenuItemForm[menuItemType])
    .first()
    .click()
    .invoke("text")
    .then(text => {
      selectedItem = text;
      cy.addAliasToGraphRequest("MenuItemCreate")
        .get(BUTTON_SELECTORS.submit)
        .click();
      confirmationMessageShouldDisappear();
      cy.wait("@MenuItemCreate");
    })
    .then(() => selectedItem);
}

export const MENU_ITEM_TYPES = {
  category: "categoryItem",
  collection: "collectionItem",
  page: "pageItem"
};
