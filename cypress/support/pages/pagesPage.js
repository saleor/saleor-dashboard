import { PAGE_DETAILS_SELECTORS } from "../../elements/pages/page-details";
import { PAGES_LIST_SELECTORS } from "../../elements/pages/pages-list";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { urlList } from "../../fixtures/urlList";

export const attributesTypes = {
  DROPDOWN: addSelectAttributeValue,
  MULTISELECT: addSelectAttributeValue,
  RICH_TEXT: addRichTextAttributeValue,
  BOOLEAN: addBooleanAttributeValue,
  NUMERIC: addNumericAttributeValue,
};

export function fillUpPageTypeDialog({ pageTypeName }) {
  const organization = {};
  return cy
    .fillAutocompleteSelect(
      PAGES_LIST_SELECTORS.dialogPageTypeInput,
      pageTypeName,
    )
    .then(selected => {
      organization.pageType = selected;
      return organization;
    });
}

export function createPage({
  pageName,
  pageTypeName,
  isPublished = false,
  attributeType = "DROPDOWN",
  attributeValue,
}) {
  openCreatePageAndFillUpGeneralFields({ pageName, pageTypeName, isPublished });
  attributesTypes[attributeType](attributeValue);
  return savePage();
}
export function createPageWithAttribute({
  pageName,
  pageTypeName,
  isPublished = false,
  attributeType = "DROPDOWN",
  attributeValue,
}) {
  cy.get(PAGE_DETAILS_SELECTORS.nameInput).type(pageName);
  if (!isPublished) {
    cy.get(PAGE_DETAILS_SELECTORS.isNotPublishedCheckbox).click();
  }
  attributesTypes[attributeType](attributeValue);
  return savePage();
}

export function addSelectAttributeValue(attributeValue) {
  cy.fillAutocompleteSelect(
    PAGE_DETAILS_SELECTORS.attributeValues,
    attributeValue,
  );
}

export function addRichTextAttributeValue(attributeValue) {
  cy.get(PAGE_DETAILS_SELECTORS.attributeValues)
    .find(SHARED_ELEMENTS.richTextEditor.empty)
    .should("exist")
    .get(PAGE_DETAILS_SELECTORS.attributeValues)
    .find(PAGE_DETAILS_SELECTORS.richTextEditorAttributeValue)
    .type(attributeValue)
    .wait(500);
}

export function addBooleanAttributeValue() {
  cy.get(PAGE_DETAILS_SELECTORS.booleanAttributeValueCheckbox).click();
}

export function addNumericAttributeValue(attributeValue) {
  cy.get(PAGE_DETAILS_SELECTORS.numericAttributeValueInput).type(
    attributeValue,
    { force: true },
  );
}

function openCreatePageAndFillUpGeneralFields({
  pageName,
  pageTypeName,
  isPublished,
}) {
  cy.visit(urlList.pages).get(PAGES_LIST_SELECTORS.createPageButton).click();

  selectPageTypeName(pageTypeName);
  cy.get(BUTTON_SELECTORS.confirmButton)
    .click()
    .get(PAGE_DETAILS_SELECTORS.nameInput)
    .type(pageName);
  if (!isPublished) {
    cy.get(PAGE_DETAILS_SELECTORS.isNotPublishedCheckbox).click();
  }
}

export function savePage() {
  return cy
    .addAliasToGraphRequest("PageCreate")
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .confirmationMessageShouldDisappear()
    .waitForRequestAndCheckIfNoErrors("@PageCreate")
    .its("response.body.data.pageCreate.page");
}
export function openCreatePageDialog() {
  return cy.get(PAGES_LIST_SELECTORS.createPageButton).click();
}
export function selectPageTypeOnIndex(index) {
  cy.get(PAGES_LIST_SELECTORS.dialogPageTypeInput).click({ force: true });
  return cy
    .get(PAGES_LIST_SELECTORS.dialogPageTypeInputOptions)
    .eq(index)
    .click({ force: true });
}
export function selectPageTypeName(pageTypeName) {
  cy.get(PAGES_LIST_SELECTORS.dialogPageTypeInput)
    .click({ force: true })
    .type(pageTypeName);
  return cy
    .get(PAGES_LIST_SELECTORS.dialogPageTypeInputOptions)
    .contains(pageTypeName)
    .click({ force: true });
}
