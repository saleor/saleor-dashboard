import faker from "faker";

import { createCategory } from "../../../apiRequests/Category";
import { createCollection } from "../../../apiRequests/Collections";
import { createMenu, getMenu } from "../../../apiRequests/Menu";
import { createPage } from "../../../apiRequests/Page";
import { createPageType } from "../../../apiRequests/PageTypes";
import { MENU_DETAILS } from "../../../elements/navigation/menu-details";
import { MENU_LIST } from "../../../elements/navigation/menu-list";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import { confirmationMessageShouldDisappear } from "../../../steps/shared/confirmationMessage";
import { menuDetailsUrl, urlList } from "../../../url/urlList";
import { deleteMenusStartsWith } from "../../../utils/navigationUtils";

describe("Tests for menu navigation", () => {
  const startsWith = "Navigation";
  const randomName = `${startsWith}${faker.datatype.number()}`;

  let menu;
  let page;
  let category;
  let collection;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteMenusStartsWith(startsWith);
    createMenu(randomName).then(({ menu: menuResp }) => (menu = menuResp));
    createCategory(randomName).then(categoryResp => (category = categoryResp));
    createCollection(randomName).then(
      collectionResp => (collection = collectionResp)
    );
    createPageType({ name: randomName })
      .then(({ pageType }) => {
        createPage({ title: randomName, pageTypeId: pageType.id });
      })
      .then(({ page: pageResp }) => (page = pageResp));
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  xit("should create a menu", () => {
    const name = `${startsWith}${faker.datatype.number()}`;

    cy.visit(urlList.navigation)
      .get(MENU_LIST.addMenuButton)
      .click()
      .get(MENU_LIST.createMenuForm.nameInput)
      .type(name)
      .addAliasToGraphRequest("MenuCreate")
      .get(BUTTON_SELECTORS.submit)
      .click();
    confirmationMessageShouldDisappear();
    cy.wait("@MenuCreate")
      .its("response.body.data.menuCreate.menu")
      .then(menuResp => {
        getMenu(menuResp.id);
      })
      .then(({ menu: menuResp }) => {
        expect(menuResp.name).to.eq(name);
      });
  });

  it("should add new page to menu", () => {
    cy.visit(menuDetailsUrl(menu.id))
      .get(MENU_DETAILS.createNewMenuItemButton)
      .click()
      .get(MENU_DETAILS.newMenuItemForm.autocompleteSelectReference)
      .click()
      .get(SHARED_ELEMENTS.progressBar)
      .should("be.not.visible")
      .pause()
      .get('[id="downshift-0-item-0"]')
      .click()
      .pause();
  });
});
