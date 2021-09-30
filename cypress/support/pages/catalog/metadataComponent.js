import { METADATA_FORM } from "../../../elements/shared/metadata/metadata-form";

export const metadataForms = {
  private: METADATA_FORM.privateMetadataForm,
  public: METADATA_FORM.metadataForm
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
