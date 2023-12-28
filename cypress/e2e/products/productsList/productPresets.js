/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { PRESETS, SEARCH } from "../../../elements/shared";
import { LOCAL_STORAGE_KEYS, urlList } from "../../../fixtures/";
import { ensureCanvasStatic } from "../../../support/customCommands/sharedElementsOperations/canvas";
import {
  addPresetWithName,
  clickDeletePresetButton,
  clickSavedPresetContain,
  clickShowSavedPresetsButton,
  clickUpdatePresetButton,
  confirmActivePresetName,
  confirmGridRowsContainsText,
  hoverSavedPresetContain,
  searchItems,
} from "../../../support/pages/catalog/presetsAndSearch";

describe("As a user I should be able to save selected filters with search queries under the given name", () => {
  beforeEach(() => {
    cy.loginUserViaRequest();
  });

  it(
    "should be able to add preset. TC: SALEOR_2712",
    { tags: ["@productsList", "@allEnv", "@stable"] },
    () => {
      cy.visit(urlList.products);

      ensureCanvasStatic(PRODUCTS_LIST.dataGridTable).then(() => {
        cy.assertCanvasRowsNumber(PRODUCTS_LIST.dataGridTable, 21);
      });
      const presetName = "Hoodie";

      searchItems(presetName);
      addPresetWithName(presetName);
      ensureCanvasStatic(PRODUCTS_LIST.dataGridTable).then(() => {
        confirmGridRowsContainsText(presetName);
        confirmActivePresetName(presetName);
      });
    },
  );
  it(
    "should be able to update preset. TC: SALEOR_2713",
    { tags: ["@productsList", "@allEnv", "@stable"] },
    () => {
      const searchQuery = "bean";
      // space is needed since we add second part of query into input
      const updatedSearchQuery = " juice";
      window.localStorage.setItem(
        LOCAL_STORAGE_KEYS.keys.productPresets,
        `[{"data":"query=${searchQuery}","name":"${searchQuery}"}]`,
      );
      cy.visit(urlList.products);
      ensureCanvasStatic(PRODUCTS_LIST.dataGridTable);
      clickShowSavedPresetsButton();
      clickSavedPresetContain(searchQuery);
      cy.get(SEARCH.searchInput).click().type(updatedSearchQuery);
      ensureCanvasStatic(PRODUCTS_LIST.dataGridTable);
      clickUpdatePresetButton();
      ensureCanvasStatic(PRODUCTS_LIST.dataGridTable).then(() => {
        expect(
          localStorage.getItem(LOCAL_STORAGE_KEYS.keys.productPresets),
        ).to.contains(`query=${searchQuery}%20${updatedSearchQuery.trim()}`);
      });
    },
  );
  it(
    "should be able to delete preset. TC: SALEOR_2714",
    { tags: ["@productsList", "@allEnv", "@stable"] },
    () => {
      const firstPreset = "bean";
      const secondPreset = "hoodie";
      window.localStorage.setItem(
        LOCAL_STORAGE_KEYS.keys.productPresets,
        `[{"data":"query=${firstPreset}","name":"${firstPreset}"},{"data":"query=${secondPreset}","name":"${secondPreset}"}]`,
      );
      cy.visit(urlList.products);
      ensureCanvasStatic(PRODUCTS_LIST.dataGridTable);
      clickShowSavedPresetsButton();
      hoverSavedPresetContain(secondPreset);
      clickDeletePresetButton();
      cy.clickSubmitButton();
      ensureCanvasStatic(PRODUCTS_LIST.dataGridTable).then(() => {
        expect(
          localStorage.getItem(LOCAL_STORAGE_KEYS.keys.productPresets),
        ).to.contains(`query=${firstPreset}`);
        expect(
          localStorage.getItem(LOCAL_STORAGE_KEYS.keys.productPresets),
        ).to.not.contains(`query=${secondPreset}`);
        clickShowSavedPresetsButton();
        cy.get(PRESETS.savedPreset).contains(firstPreset).should("be.visible");
      });
    },
  );
});
