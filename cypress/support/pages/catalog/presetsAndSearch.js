import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { PRESETS, SEARCH } from "../../../elements/shared";

export function searchItems(name) {
  return cy
    .addAliasToGraphRequest("ProductList")
    .get(SEARCH.searchInput)
    .type(name)
    .wait("@ProductList");
}
export function addPresetWithName(name) {
  return cy
    .get(PRESETS.addPresetButton)
    .click()
    .get(PRESETS.presetNameTextField)
    .type(name)
    .get(PRESETS.savePresetNameButton)
    .click()
    .wait("@ProductList");
}
export function confirmGridRowsContainsText(name) {
  return cy
    .get(PRODUCTS_LIST.dataGridTable)
    .find("tbody")
    .find("tr")
    .should("contain.text", name);
}
export function confirmActivePresetName(name) {
  return cy.get(PRESETS.activePresetName).should("contain.text", name);
}
export function clickDeletePresetButton() {
  return cy.get(PRESETS.presetDeleteButton).click();
}
export function clickShowSavedPresetsButton() {
  cy.get(PRESETS.activePresetName).click();
}
export function clickSavedPresetContain(presetName) {
  cy.get(PRESETS.savedPreset).contains(presetName).click();
}
export function hoverSavedPresetContain(presetName) {
  cy.get(PRESETS.savedPreset).contains(presetName).trigger("mouseover");
}
export function clickUpdatePresetButton() {
  cy.get(PRESETS.updatePresetButton).click();
}
