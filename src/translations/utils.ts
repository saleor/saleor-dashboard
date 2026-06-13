import {
  AttributeInputTypeEnum,
  type AttributeTranslationDetailsFragment,
  type AttributeValueTranslatableFragment,
  type AttributeValueTranslationInput,
} from "@dashboard/graphql";
import { isFieldTranslationComplete } from "@dashboard/translations/progress";
import {
  PageTranslationInputFieldName,
  type TranslationField,
  TranslationFieldType,
  TranslationInputFieldName,
} from "@dashboard/translations/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getParsedDataForJsonStringField } from "@dashboard/utils/richText/misc";
import { type OutputData } from "@editorjs/editorjs";
import { type IntlShape } from "react-intl";

import { fieldNames } from "./components/TranslationsAttributesPage";
import { transtionsAttributesPageFieldsMessages as messages } from "./components/TranslationsAttributesPage/messages";

export const getParsedTranslationInputData = ({
  fieldName,
  data,
}: {
  fieldName: TranslationInputFieldName | PageTranslationInputFieldName;
  data: string | OutputData;
}): Record<string, string | null> => {
  const fieldsToParse = [
    TranslationInputFieldName.description,
    PageTranslationInputFieldName.content,
  ];

  if (fieldsToParse.includes(fieldName)) {
    return {
      [fieldName]: getParsedDataForJsonStringField(data as OutputData),
    };
  }

  return { [fieldName]: data as string };
};

export const getTranslationFields = (
  fields: NonNullable<NonNullable<AttributeTranslationDetailsFragment["attribute"]>["choices"]>,
  intl: IntlShape,
) =>
  mapEdgesToItems(fields)?.map(({ id, name, translation }, attributeValueIndex) => {
    const displayName = intl.formatMessage(messages.valueNumber, {
      number: attributeValueIndex + 1,
    });

    return {
      displayName,
      name: `${fieldNames.value}:${id}`,
      translation: translation?.name || null,
      type: "short" as TranslationField["type"],
      value: name,
    };
  }) ?? [];

const getAttributeValueTranslationFieldType = (
  inputType: AttributeInputTypeEnum | null | undefined,
): TranslationFieldType =>
  inputType === AttributeInputTypeEnum.RICH_TEXT
    ? TranslationFieldType.RICH
    : TranslationFieldType.SHORT;

export const getAttributeValueTranslationContent = (
  translation: AttributeValueTranslatableFragment["translation"],
): string | null => translation?.richText || translation?.plainText || null;

export const isAttributeValueTranslationComplete = (
  attributeValue: Pick<AttributeValueTranslatableFragment, "attributeValue" | "translation">,
): boolean => {
  const type = getAttributeValueTranslationFieldType(attributeValue.attributeValue?.inputType);
  const translation =
    type === TranslationFieldType.RICH
      ? (attributeValue.translation?.richText ?? null)
      : (attributeValue.translation?.plainText ?? null);

  return isFieldTranslationComplete(translation, type);
};

export const mapAttributeValuesToTranslationFields = (
  attributeValues: AttributeValueTranslatableFragment[],
  intl: IntlShape,
) =>
  attributeValues.map<TranslationField>(attrVal => {
    const type = getAttributeValueTranslationFieldType(attrVal.attributeValue?.inputType);

    return {
      id: attrVal.attributeValue?.id,
      displayName: intl.formatMessage(
        {
          id: "zgqPGF",
          defaultMessage: "Attribute {name}",
          description: "attribute list",
        },
        {
          name: attrVal.attribute?.name,
        },
      ),
      name: attrVal.attributeValue?.id ?? attrVal.id,
      translation: getAttributeValueTranslationContent(attrVal.translation),
      type,
      value: attrVal.richText || attrVal.plainText || "",
    };
  }) || [];

export const getAttributeValueTranslationsInputData = (
  type: TranslationFieldType,
  data: OutputData | string,
): AttributeValueTranslationInput =>
  type === TranslationFieldType.RICH
    ? { richText: JSON.stringify(data) }
    : { plainText: data as string };
