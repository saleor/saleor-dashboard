import { OutputData } from "@editorjs/editorjs";
import { getParsedDataForJsonStringField } from "@saleor/utils/richText/misc";

import {
  PageTranslationInputFieldName,
  TranslationInputFieldName
} from "./types";

export const getParsedTranslationInputData = ({
  fieldName,
  data
}: {
  fieldName: TranslationInputFieldName | PageTranslationInputFieldName;
  data: string | OutputData;
}): Record<string, string | null> => {
  const fieldsToParse = [
    TranslationInputFieldName.description,
    PageTranslationInputFieldName.content
  ];

  if (fieldsToParse.includes(fieldName)) {
    return {
      [fieldName]: getParsedDataForJsonStringField(data as OutputData)
    };
  }

  return { [fieldName]: data as string };
};
