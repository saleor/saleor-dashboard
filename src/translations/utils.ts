// @ts-strict-ignore
import {
  AttributeTranslationDetailsFragment,
  AttributeValueTranslatableFragment,
  AttributeValueTranslationInput,
} from "@dashboard/graphql";
import { TranslationField, TranslationFieldType } from "@dashboard/translations/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getParsedDataForJsonStringField } from "@dashboard/utils/richText/misc";
import { OutputData } from "@editorjs/editorjs";
import { IntlShape } from "react-intl";

import { fieldNames } from "./components/TranslationsAttributesPage";
import { transtionsAttributesPageFieldsMessages as messages } from "./components/TranslationsAttributesPage/messages";
import { PageTranslationInputFieldName, TranslationInputFieldName } from "./types";

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
  fields: AttributeTranslationDetailsFragment["attribute"]["choices"],
  intl: IntlShape,
) =>
  mapEdgesToItems(fields).map(({ id, name, translation }, attributeValueIndex) => {
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
  }) || [];

export const mapAttributeValuesToTranslationFields = (
  attributeValues: AttributeValueTranslatableFragment[],
  intl: IntlShape,
) =>
  attributeValues.map<TranslationField>(attrVal => ({
    id: attrVal.attributeValue.id,
    displayName: intl.formatMessage(
      {
        id: "zgqPGF",
        defaultMessage: "Attribute {name}",
        description: "attribute list",
      },
      {
        name: attrVal.attribute.name,
      },
    ),
    name: attrVal.name,
    translation: attrVal.translation?.richText || attrVal.translation?.plainText || null,
    type: attrVal.richText ? "rich" : "short",
    value: attrVal.richText || attrVal.plainText,
  })) || [];

export const getAttributeValueTranslationsInputData = (
  type: TranslationFieldType,
  data: OutputData | string,
): AttributeValueTranslationInput =>
  type === TranslationFieldType.RICH
    ? { richText: JSON.stringify(data) }
    : { plainText: data as string };
