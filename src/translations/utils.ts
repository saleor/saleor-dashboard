import {
  AttributeInputTypeEnum,
  type AttributeTranslationDetailsFragment,
  type AttributeValueTranslatableFragment,
  type AttributeValueTranslationInput,
} from "@dashboard/graphql";
import {
  isBlankTextTranslation,
  isEmptyRichTextDocument,
  isFieldTranslationComplete,
} from "@dashboard/translations/progress";
import { type TranslationField, TranslationFieldType } from "@dashboard/translations/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getParsedDataForJsonStringField } from "@dashboard/utils/richText/misc";
import { type OutputData } from "@editorjs/editorjs";
import { type IntlShape } from "react-intl";

import { transtionsAttributesPageFieldsMessages as messages } from "./components/TranslationsAttributesPage/messages";
import { fieldNames } from "./components/TranslationsAttributesPage/TranslationsAttributesPage";

export const getParsedTranslationInputData = ({
  field,
  data,
}: {
  field: Pick<TranslationField, "name" | "nullable">;
  data: string | OutputData;
}): Record<string, string | null> => {
  if (typeof data !== "string") {
    return { [field.name]: getParsedDataForJsonStringField(data) };
  }

  if (isBlankTextTranslation(data)) {
    // `null` removes the translation so storefronts fall back to the original; `""` would show a blank.
    return { [field.name]: field.nullable ? null : "" };
  }

  return { [field.name]: data };
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

/** Reads the translated content for the field type; a stored `""` stays `""` so it can be reset. */
export const getAttributeValueTranslationContent = ({
  translation,
  type,
}: {
  translation: AttributeValueTranslatableFragment["translation"];
  type: TranslationFieldType;
}): string | null =>
  (type === TranslationFieldType.RICH ? translation?.richText : translation?.plainText) ?? null;

export const isAttributeValueTranslationComplete = (
  attributeValue: Pick<AttributeValueTranslatableFragment, "attributeValue" | "translation">,
): boolean => {
  const type = getAttributeValueTranslationFieldType(attributeValue.attributeValue?.inputType);

  return isFieldTranslationComplete(
    getAttributeValueTranslationContent({ translation: attributeValue.translation, type }),
    type,
  );
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
      // Saving needs the attribute value id; without it a reset would be skipped.
      nullable: Boolean(attrVal.attributeValue?.id),
      translation: getAttributeValueTranslationContent({ translation: attrVal.translation, type }),
      type,
      value: attrVal.richText || attrVal.plainText || "",
    };
  }) || [];

export const getAttributeValueTranslationsInputData = (
  type: TranslationFieldType,
  data: OutputData | string,
): AttributeValueTranslationInput => {
  if (typeof data !== "string") {
    return { richText: getParsedDataForJsonStringField(data) };
  }

  if (type === TranslationFieldType.RICH) {
    // Already serialized EditorJS content.
    const isEmpty = isBlankTextTranslation(data) || isEmptyRichTextDocument(data);

    return { richText: isEmpty ? null : data };
  }

  if (isBlankTextTranslation(data)) {
    // Without `name`, the API derives it from `plainText` and fails on `null`.
    return { name: "", plainText: null };
  }

  return { plainText: data };
};
