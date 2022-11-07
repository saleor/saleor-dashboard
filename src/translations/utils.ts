import { OutputData } from "@editorjs/editorjs";
import { AttributeTranslationDetailsFragment } from "@saleor/graphql";
import { TranslationField } from "@saleor/translations/types";
import { mapEdgesToItems } from "@saleor/utils/maps";
import { getParsedDataForJsonStringField } from "@saleor/utils/richText/misc";
import { IntlShape } from "react-intl";

import { fieldNames } from "./components/TranslationsAttributesPage";
import { transtionsAttributesPageFieldsMessages as messages } from "./components/TranslationsAttributesPage/messages";
import {
  PageTranslationInputFieldName,
  TranslationInputFieldName,
} from "./types";

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
  mapEdgesToItems(fields).map(
    ({ id, name, translation }, attributeValueIndex) => {
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
    },
  ) || [];
