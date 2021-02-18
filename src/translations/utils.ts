import { OutputData } from "@editorjs/editorjs";
import { TranslationInput } from "@saleor/types/globalTypes";

import { TranslationInputFieldName } from "./types";

export const getParsedTranslationInputData = ({
  fieldName,
  data
}: {
  fieldName: keyof TranslationInput;
  data: string | OutputData;
}): Record<string, string | null> => {
  if (fieldName === TranslationInputFieldName.description) {
    return {
      description: getParsedDataForJsonStringField(data as OutputData)
    };
  }

  return { [fieldName]: data as string };
};

export const getParsedDataForJsonStringField = (
  data: OutputData
): string | null => (!!data.blocks?.length ? JSON.stringify(data) : null);
