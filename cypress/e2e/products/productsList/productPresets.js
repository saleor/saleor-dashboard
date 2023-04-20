/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { urlList } from "../../../fixtures/urlList";
import { ensureCanvasStatic } from "../../../support/customCommands/sharedElementsOperations/canvas";
import {
  addPresetWithName,
  confirmActivePresetName,
  confirmGridRowsContainsText,
  searchItems,
} from "../../../support/pages/catalog/presetsAndSearch";

describe("As a user I should be able to save selected filters with search queries under the given name", () => {
  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
    cy.visit(urlList.products);
  });

  it(
    "should be able to add preset. TC: SALEOR_3802",
    { tags: ["@productsList", "@allEnv", "@stable"] },
    () => {
      ensureCanvasStatic(PRODUCTS_LIST.dataGridTable).then(() => {
        cy.assertCanvasRowsNumber(PRODUCTS_LIST.dataGridTable, 21);
      });
      const presetName = "hoodie";

      searchItems(presetName);
      addPresetWithName(presetName);
      ensureCanvasStatic(PRODUCTS_LIST.dataGridTable).then(() => {
        confirmGridRowsContainsText(presetName);
        confirmActivePresetName(presetName);
      });
    },
  );
});
