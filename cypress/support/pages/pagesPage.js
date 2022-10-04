import { PAGE_DETAILS } from "../../elements/pages/page-details";
import { PAGES_LIST } from "../../elements/pages/pages-list";
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
    .fillAutocompleteSelect(PAGES_LIST.dialogPageTypeInput, pageTypeName)
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

export function addSelectAttributeValue(attributeValue) {
  cy.fillAutocompleteSelect(PAGE_DETAILS.attributeValues, attributeValue);
}

export function addRichTextAttributeValue(attributeValue) {
  cy.get(PAGE_DETAILS.attributeValues)
    .find(SHARED_ELEMENTS.richTextEditor.empty)
    .should("exist")
    .get(PAGE_DETAILS.attributeValues)
    .find(PAGE_DETAILS.richTextEditorAttributeValue)
    .type(attributeValue)
    .wait(500);
}

export function addBooleanAttributeValue() {
  cy.get(PAGE_DETAILS.booleanAttributeValueCheckbox).click();
}

export function addNumericAttributeValue(attributeValue) {
  cy.get(PAGE_DETAILS.numericAttributeValueInput).type(attributeValue);
}

function openCreatePageAndFillUpGeneralFields({
  pageName,
  pageTypeName,
  isPublished,
}) {
  cy.visit(urlList.pages)
    .get(PAGES_LIST.createPageButton)
    .click();
  fillUpPageTypeDialog({ pageTypeName });
  cy.get(BUTTON_SELECTORS.submit)
    .click()
    .get(PAGE_DETAILS.nameInput)
    .type(pageName);
  if (!isPublished) {
    cy.get(PAGE_DETAILS.isNotPublishedCheckbox).click();
  }
  cy.fillAutocompleteSelect(
    PAGE_DETAILS.pageTypesAutocompleteSelect,
    pageTypeName,
  );
}

function savePage() {
  return cy
    .addAliasToGraphRequest("PageCreate")
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .confirmationMessageShouldDisappear()
    .waitForRequestAndCheckIfNoErrors("@PageCreate")
    .its("response.body.data.pageCreate.page");
}
