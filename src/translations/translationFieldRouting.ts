import {
  type TranslationField,
  type TranslationSectionConfig,
  TranslationSubmitScope,
} from "@dashboard/translations/types";

export function isAttributeValueTranslationField(
  field: TranslationField,
  sections: TranslationSectionConfig[],
): boolean {
  return sections.some(
    section =>
      section.submitScope === TranslationSubmitScope.attributeValue &&
      section.fields.some(attributeField => attributeField.name === field.name),
  );
}
