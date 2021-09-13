import { ATTRIBUTES_DETAILS } from "../elements/attribute/attributes_details";
import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";

export function createAttributeWithInputType({
  name,
  attributeType,
  entityType,
  numericSystemType,
  valueRequired = true
}) {
  fillUpAttributeCreateFields({ name, attributeType, valueRequired });
  if (attributeType === "DROPDOWN" || attributeType === "MULTISELECT") {
    addSingleValue(name);
  }
  if (attributeType === "REFERENCE") {
    selectEntityType(entityType);
  }
  if (attributeType === "NUMERIC" && numericSystemType.unitsOf) {
    selectNumericSystem(numericSystemType);
  }
  return saveAttribute();
}

export function fillUpAttributeCreateFields({
  name,
  attributeType,
  valueRequired
}) {
  cy.get(ATTRIBUTES_DETAILS.nameInput)
    .type(name)
    .get(ATTRIBUTES_DETAILS.codeInput)
    .type(name)
    .get(ATTRIBUTES_DETAILS.inputTypeSelect)
    .click()
    .get(ATTRIBUTES_DETAILS.attributesInputTypes[attributeType])
    .click();
  if (!valueRequired) {
    cy.get(ATTRIBUTES_DETAILS.valueRequired).click();
  }
}

export function saveAttribute() {
  return cy
    .addAliasToGraphRequest("AttributeCreate")
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .wait("@AttributeCreate")
    .its("response.body.data.attributeCreate");
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
