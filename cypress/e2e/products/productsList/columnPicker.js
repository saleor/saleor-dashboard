/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import { SHARED_ELEMENTS } from "../../../elements";
import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { LOCAL_STORAGE_FOR_COLUMN_PICKER } from "../../../fixtures";
import { urlList } from "../../../fixtures/urlList";
import { ensureCanvasStatic } from "../../../support/customCommands/sharedElementsOperations/canvas";
import { columnPickerPage } from "../../../support/pages";

describe("As an admin I should be able to use column picker", () => {
  beforeEach(() => {
    cy.loginUserViaRequest();
  });

  it(
    "should be able to add new dynamic column to grid on product list via search. TC: SALEOR_2610  should not be migrated to playwright as critical",
    { tags: ["@critical", "@allEnv", "@stable"] },
    () => {
      const dynamicColumnToBeSearched = "Flavor";
      cy.addAliasToGraphRequest("AvailableColumnAttributes");
      cy.visit(urlList.products);

      ensureCanvasStatic(PRODUCTS_LIST.dataGridTable);
      columnPickerPage.openColumnPicker();
      columnPickerPage.openDynamicColumnsSearch();
      columnPickerPage.typeNameInSearchColumnInput(dynamicColumnToBeSearched);
      cy.waitForRequestAndCheckIfNoErrors("@AvailableColumnAttributes");
      cy.get(SHARED_ELEMENTS.dynamicColumnSelector)
        .should("have.length", 1)
        .should("contain.text", dynamicColumnToBeSearched)
        .find("button")
        .click();
      cy.get(SHARED_ELEMENTS.dynamicColumnSelector)
        .invoke("text")
        .then(selectedColumnName => {
          cy.get(SHARED_ELEMENTS.dynamicColumnContainer)
            // do not check by visible text just data-test-id since often text has ellipsis
            .find(`[data-test-id="column-name-${selectedColumnName}"]`)
            .should("be.visible");
          // newly added dynamic column is alway placed as last one on grid
          cy.get(SHARED_ELEMENTS.dataGridTable)
            .find("th")
            .last()
            .should("have.text", selectedColumnName);
        });
    },
  );
  it.skip(
    "should be able to remove dynamic column from picker on products list. TC: SALEOR_2611",
    { tags: ["@productsList", "@allEnv", "@stable"] },
    () => {
      const listConfigLocalStorage = JSON.stringify(
        LOCAL_STORAGE_FOR_COLUMN_PICKER.listConfigWithAttributeColumnPicker,
      );
      // local storage is updated to avoid not necessary action of adding dynamic column in the beginning of test
      cy.window().then(win => {
        win.localStorage.setItem("listConfig", listConfigLocalStorage);
      });
      cy.visit(urlList.products);
      ensureCanvasStatic(PRODUCTS_LIST.dataGridTable);
      columnPickerPage.openColumnPicker();
      cy.get(SHARED_ELEMENTS.dynamicColumnContainer)
        .find(SHARED_ELEMENTS.selectedDynamicColumnNameSelector)
        .should("have.length", 1)
        .invoke("text")
        .then(columnName => {
          cy.get(SHARED_ELEMENTS.dynamicColumnContainer)
            .find(SHARED_ELEMENTS.removeSelectedDynamicColumnButton)
            .should("be.visible")
            .should("have.length", 1)
            .click();
          cy.get(SHARED_ELEMENTS.dynamicColumnContainer)
            .find(SHARED_ELEMENTS.removeSelectedDynamicColumnButton)
            .should("not.exist");
          cy.get(SHARED_ELEMENTS.dynamicColumnContainer)
            .find(columnName)
            .should("not.exist");
        });
    },
  );
  it(
    "should validate: that there is always at least one active static column, use pagination when searching dynamic columns, hiding column picker works. TC: SALEOR_2612",
    { tags: ["@productsList", "@allEnv", "@stable"] },
    () => {
      cy.addAliasToGraphRequest("ProductDetails");
      // local storage accepts only strings
      const listConfigLocalStorage = JSON.stringify(
        LOCAL_STORAGE_FOR_COLUMN_PICKER.localStorageWithSingleStaticColumn,
      );
      // local storage is updated to make sure only one static column is active
      cy.window().then(win => {
        win.localStorage.setItem("listConfig", listConfigLocalStorage);
      });
      cy.visit(urlList.products);
      ensureCanvasStatic(PRODUCTS_LIST.dataGridTable);
      columnPickerPage.openColumnPicker();
      cy.get(SHARED_ELEMENTS.activeStaticColumnOnGridButton).should(
        "have.length",
        1,
        "There should be only one active static column",
      );
      columnPickerPage.openDynamicColumnsSearch();

      cy.get(SHARED_ELEMENTS.paginationBackOnColumnPicker).should(
        "have.attr",
        "disabled",
      );
      cy.get(SHARED_ELEMENTS.paginationForwardOnColumnPicker).click();
      cy.get(SHARED_ELEMENTS.paginationBackOnColumnPicker).should(
        "not.have.attr",
        "disabled",
      );
      columnPickerPage
        .selectDynamicColumnAtIndex(1)
        .invoke("text")
        .then(selectedColumnName => {
          cy.get(SHARED_ELEMENTS.dynamicColumnContainer)
            // do not check by visible text just data-test-id since often text has ellipsis
            .find(`[data-test-id*="${selectedColumnName}"]`)
            .should("be.visible");
          // newly added dynamic column is alway placed as last one on grid
          cy.get(SHARED_ELEMENTS.dataGridTable)
            .find("th")
            .last()
            .should("have.text", selectedColumnName);
          //next line hides picker
          cy.get(SHARED_ELEMENTS.pageHeader).click({ force: true });
          cy.get(SHARED_ELEMENTS.dynamicColumnContainer).should("not.exist");
        });
    },
  );
});
