import {
  type TranslationField,
  TranslationFieldType,
  type TranslationSectionConfig,
} from "@dashboard/translations/types";
import { type OutputData } from "@editorjs/editorjs";
import { useCallback, useState } from "react";

export interface BulkTranslationValue {
  field: TranslationField;
  section: TranslationSectionConfig;
  data: string | OutputData;
}

const parseBulkFieldValue = (
  field: TranslationField,
  rawValue: string | null,
): string | OutputData => {
  if (field.type === TranslationFieldType.RICH) {
    if (!rawValue) {
      return { blocks: [] } as OutputData;
    }

    try {
      return JSON.parse(rawValue) as OutputData;
    } catch {
      return { blocks: [] } as OutputData;
    }
  }

  return rawValue ?? "";
};

export function useTranslationBulkValues(sections: TranslationSectionConfig[]) {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleValueChange = useCallback((field: TranslationField, value: string) => {
    setValues(previousValues => ({
      ...previousValues,
      [field.name]: value,
    }));
  }, []);

  const resetValues = useCallback(() => {
    setValues({});
  }, []);

  const getBulkSubmitValues = useCallback((): BulkTranslationValue[] => {
    return sections.flatMap(section =>
      section.fields.map(field => {
        const rawValue = values[field.name] ?? field.translation;

        return {
          field,
          section,
          data: parseBulkFieldValue(field, rawValue),
        };
      }),
    );
  }, [sections, values]);

  return {
    getBulkSubmitValues,
    handleValueChange,
    resetValues,
  };
}
