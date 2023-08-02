import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";

export function openColumnPicker() {
  cy.get(SHARED_ELEMENTS.openColumnPickerButton).click();
}
export function openDynamicColumnsSearch() {
  cy.get(SHARED_ELEMENTS.openDynamicColumnsSearchButton).click();
}
export function selectDynamicColumnAtIndex(columnIndex) {
  return cy
    .get(SHARED_ELEMENTS.dynamicColumnNameSelector)
    .eq(columnIndex)
    .click();
}
export function typeNameInSearchColumnInput(columnName) {
  return cy
    .get(SHARED_ELEMENTS.dynamicColumnSearchInput)
    .should("be.visible")
    .click()
    .type(columnName)
    .blur();
}
