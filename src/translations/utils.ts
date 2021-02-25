import { OutputData } from "@editorjs/editorjs";

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
      description: getParsedDataForJsonStringField(data as OutputData)
    };
  }

  return { [fieldName]: data as string };
};

export const getParsedDataForJsonStringField = (
  data: OutputData
): string | null => (!!data.blocks?.length ? JSON.stringify(data) : null);
