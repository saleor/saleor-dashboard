/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import {
  createMenu as createMenuViaApi,
  getMenu
} from "../../support/api/requests/Menu";
import { deleteMenusStartsWith } from "../../support/api/utils/navigationUtils";
import filterTests from "../../support/filterTests";
import {
  createMenu,
  createNewMenuItem,
  MENU_ITEM_TYPES
} from "../../support/pages/navigationPage";

filterTests({ definedTags: ["all"] }, () => {
  describe("Tests for menu navigation", () => {
    const startsWith = "Navigation";
    const randomName = `${startsWith}${faker.datatype.number()}`;

    let menu;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteMenusStartsWith(startsWith);
      createMenuViaApi(randomName).then(
        ({ menu: menuResp }) => (menu = menuResp)
      );
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
    });

    it("should create a menu", () => {
      const name = `${startsWith}${faker.datatype.number()}`;

      createMenu(name)
        .then(menuResp => {
          getMenu(menuResp.id);
        })
        .then(menuResp => {
          expect(menuResp.name).to.eq(name);
        });
    });

    ["category", "collection", "page"].forEach(itemType => {
      it(`should add new ${itemType} item to menu`, () => {
        const itemName = `${startsWith}${faker.datatype.number()}`;
        let selectedItem;

        createNewMenuItem({
          menuId: menu.id,
          name: itemName,
          menuItemType: MENU_ITEM_TYPES[itemType]
        })
          .then(selectedItemResp => {
            selectedItem = selectedItemResp;
            getMenu(menu.id);
          })
          .then(({ items }) => {
            const item = items.find(element => element.name === itemName);
            const itemOfType = item[itemType];
            const name = itemType !== "page" ? "name" : "title";
            expect(itemOfType[name]).to.eq(selectedItem);
          });
      });
    });
  });
});
