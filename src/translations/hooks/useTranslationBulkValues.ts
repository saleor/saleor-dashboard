import {
  getDirtyBulkSubmitValues,
  hasDirtyBulkFields,
  isBulkFieldDirty,
} from "@dashboard/translations/bulkFieldDirty";
import {
  type BulkTranslationValue,
  type TranslationField,
  type TranslationSectionConfig,
} from "@dashboard/translations/types";
import { useCallback, useMemo, useState } from "react";

/** Tracks in-progress translation field values for value-diff dirty detection in bulk and single-field edit modes. */
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

  const clearFieldValues = useCallback((fieldNames: string[]) => {
    if (fieldNames.length === 0) {
      return;
    }

    setValues(previousValues => {
      const nextValues = { ...previousValues };

      fieldNames.forEach(fieldName => {
        delete nextValues[fieldName];
      });

      return nextValues;
    });
  }, []);

  const isFieldDirty = useCallback(
    (field: TranslationField) => isBulkFieldDirty(field, values[field.name]),
    [values],
  );

  const hasDirtyFields = useMemo(() => hasDirtyBulkFields(sections, values), [sections, values]);

  const getDirtyValues = useCallback(
    (): BulkTranslationValue[] => getDirtyBulkSubmitValues(sections, values),
    [sections, values],
  );

  return {
    clearFieldValues,
    getDirtyValues,
    handleValueChange,
    hasDirtyFields,
    isFieldDirty,
    resetValues,
  };
}
