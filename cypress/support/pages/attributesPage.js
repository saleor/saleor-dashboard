import { ATTRIBUTES_DETAILS } from "../../elements/attribute/attributes_details";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { attributeDetailsUrl } from "../../fixtures/urlList";

export function createAttributeWithInputType({
  name,
  attributeType,
  entityType,
  numericSystemType,
  swatchImage,
  valueRequired = true
}) {
  fillUpAttributeCreateFields({ name, attributeType, valueRequired });
  if (
    attributeType === "DROPDOWN" ||
    attributeType === "MULTISELECT" ||
    (attributeType === "SWATCH" && !swatchImage)
  ) {
    addSingleValue(name);
  }
  if (attributeType === "REFERENCE") {
    selectEntityType(entityType);
  }
  if (attributeType === "NUMERIC" && numericSystemType.unitsOf) {
    selectNumericSystem(numericSystemType);
  }
  if (attributeType === "SWATCH" && swatchImage) {
    selectSwatchImage(name, swatchImage);
  }
  return saveAttribute();
}

export function fillUpAttributeCreateFields({
  name,
  attributeType,
  valueRequired
}) {
  fillUpAttributeNameAndCode(name);
  cy.get(ATTRIBUTES_DETAILS.inputTypeSelect)
    .click()
    .get(ATTRIBUTES_DETAILS.attributesInputTypes[attributeType])
    .click();
  if (!valueRequired) {
    cy.get(ATTRIBUTES_DETAILS.valueRequired).click();
  }
}

export function fillUpAttributeNameAndCode(name, code = name) {
  return cy
    .get(ATTRIBUTES_DETAILS.nameInput)
    .clearAndType(name)
    .get(ATTRIBUTES_DETAILS.codeInput)
    .clearAndType(code);
}

export function saveAttribute() {
  cy.addAliasToGraphRequest("AttributeCreate");
  submitAttribute();
  return cy
    .waitForRequestAndCheckIfNoErrors("@AttributeCreate")
    .its("response.body.data.attributeCreate");
}

export function submitAttribute() {
  cy.get(BUTTON_SELECTORS.confirm)
    .click()
    .confirmationMessageShouldDisappear();
}

export function addSingleValue(valueName) {
  cy.get(ATTRIBUTES_DETAILS.assignValuesButton)
    .click()
    .get(ATTRIBUTES_DETAILS.valueNameInput)
    .type(valueName)
    .get(BUTTON_SELECTORS.submit)
    .click();
}

export function selectEntityType(entityType) {
  cy.get(ATTRIBUTES_DETAILS.entityTypeSelect)
    .click()
    .get(ATTRIBUTES_DETAILS.entityTypeOptions[entityType])
    .click();
}

export function selectNumericSystem({ unitSystem, unitsOf, unit }) {
  cy.get(ATTRIBUTES_DETAILS.selectUnitCheckbox)
    .click()
    .get(ATTRIBUTES_DETAILS.unitSystemSelect)
    .click()
    .get(ATTRIBUTES_DETAILS.unitSystemsOptions[unitSystem])
    .click()
    .get(ATTRIBUTES_DETAILS.unitOfSelect)
    .click()
    .get(ATTRIBUTES_DETAILS.unitsOfOptions[unitsOf])
    .click()
    .get(ATTRIBUTES_DETAILS.unitSelect)
    .click()
    .get(ATTRIBUTES_DETAILS.unitsOptions[unit])
    .click();
}

export function enterAttributeAndChanegeIsFilterableInDashbord(attributeId) {
  cy.visit(attributeDetailsUrl(attributeId))
    .waitForProgressBarToNotBeVisible()
    .get(ATTRIBUTES_DETAILS.dashboardProperties.useInFilteringCheckbox)
    .click();
  submitAttribute();
}

export function selectSwatchImage(valueName, image) {
  cy.get(ATTRIBUTES_DETAILS.assignValuesButton)
    .click()
    .get(ATTRIBUTES_DETAILS.valueNameInput)
    .type(valueName)
    .get(ATTRIBUTES_DETAILS.imageCheckbox)
    .click()
    .get(ATTRIBUTES_DETAILS.uploadFileButton)
    .click()
    .get(SHARED_ELEMENTS.fileInput)
    .attachFile(image)
    .get(ATTRIBUTES_DETAILS.uploadFileButton)
    .should("be.enabled")
    .get(BUTTON_SELECTORS.submit)
    .click();
}
