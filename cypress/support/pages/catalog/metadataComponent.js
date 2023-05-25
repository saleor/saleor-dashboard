import { METADATA_FORM } from "../../../elements/shared/metadata/metadata-form";

export const metadataForms = {
  private: METADATA_FORM.privateMetadataForm,
  public: METADATA_FORM.metadataForm,
};

export function addMetadataField({ metadataForm, name, value }) {
  return cy
    .get(metadataForm)
    .find(METADATA_FORM.addFieldButton)
    .click()
    .get(metadataForm)
    .find(METADATA_FORM.nameInput)
    .type(name)
    .get(metadataForm)
    .find(METADATA_FORM.valueField)
    .type(value);
}
export function addPublicMetadataFieldFulfillmentOrder(
  fulfillmentIndex,
  name,
  value,
) {
  expandPublicFulfillmentMetadata(fulfillmentIndex);
  cy.get('[data-test-id="fulfilled-order-section"]')
    .eq(fulfillmentIndex)
    .find('[data-test-is-private="false"]')
    .find(METADATA_FORM.addFieldButton)
    .click();
  typePublicFulfillmentMetadataName(name, 0);
  typePublicFulfillmentMetadataValue(value, 0);
}
export function updatePublicMetadataFieldFulfillmentOrder(
  fulfillmentIndex,
  name,
  value,
) {
  expandPublicFulfillmentMetadata(fulfillmentIndex);
  typePublicFulfillmentMetadataName(name, 0);
  typePublicFulfillmentMetadataValue(value, 0);
}

export function typePublicFulfillmentMetadataValue(name, valueIndex) {
  return cy
    .get(METADATA_FORM.publicMetaSection)
    .find(METADATA_FORM.valueField)
    .eq(valueIndex)
    .clear()
    .type(name);
}
export function typePrivateFulfillmentMetadataValue(name, valueIndex) {
  return cy
    .get(METADATA_FORM.privateMetaSection)
    .find(METADATA_FORM.valueField)
    .eq(valueIndex)
    .clear()
    .type(name);
}
export function typePublicFulfillmentMetadataName(name, nameIndex) {
  return cy
    .get(METADATA_FORM.publicMetaSection)
    .find(METADATA_FORM.nameInput)
    .eq(nameIndex)
    .clear()
    .type(name);
}
export function typePrivateFulfillmentMetadataName(name, nameIndex) {
  return cy
    .get(METADATA_FORM.privateMetaSection)
    .find(METADATA_FORM.nameInput)
    .eq(nameIndex)
    .clear()
    .type(name);
}
export function expandPublicFulfillmentMetadata(fulfillmentIndex) {
  return cy
    .get(METADATA_FORM.fulfillmentMetaSection)
    .eq(fulfillmentIndex)
    .find(METADATA_FORM.publicMetaSection)
    .find(METADATA_FORM.metaExpandButton)
    .click();
}
export function deletePublicFulfillmentMetadata(
  fulfillmentIndex,
  metaDataIndex,
) {
  return cy
    .get(METADATA_FORM.fulfillmentMetaSection)
    .eq(fulfillmentIndex)
    .find(METADATA_FORM.publicMetaSection)
    .find(METADATA_FORM.metaDeletedButton)
    .eq(metaDataIndex)
    .click();
}
export function deletePrivateFulfillmentMetadata(
  fulfillmentIndex,
  metaDataIndex,
) {
  return cy
    .get(METADATA_FORM.fulfillmentMetaSection)
    .eq(fulfillmentIndex)
    .find(METADATA_FORM.privateMetaSection)
    .find(METADATA_FORM.metaDeletedButton)
    .eq(metaDataIndex)
    .click();
}
export function expandPrivateFulfillmentMetadata(fulfillmentIndex) {
  return cy
    .get(METADATA_FORM.fulfillmentMetaSection)
    .eq(fulfillmentIndex)
    .find(METADATA_FORM.privateMetaSection)
    .find(METADATA_FORM.metaExpandButton)
    .click();
}
export function addPrivateMetadataFieldFulfillmentOrder(
  fulfillmentIndex,
  name,
  value,
) {
  expandPrivateFulfillmentMetadata(fulfillmentIndex);
  cy.get(METADATA_FORM.fulfillmentMetaSection)

    .eq(fulfillmentIndex)
    .find(METADATA_FORM.privateMetaSection)
    .find(METADATA_FORM.addFieldButton)
    .click();
  typePrivateFulfillmentMetadataName(name, 0);
  typePrivateFulfillmentMetadataValue(value, 0);
}
export function updatePrivateMetadataFieldFulfillmentOrder(
  fulfillmentIndex,
  name,
  value,
) {
  expandPrivateFulfillmentMetadata(fulfillmentIndex);
  typePrivateFulfillmentMetadataName(name, 0);
  typePrivateFulfillmentMetadataValue(value, 0);
}
