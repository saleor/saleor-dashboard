import {
  type BulkFieldState,
  getBlankResetBulkValues,
  getBulkFieldState,
  getDirtyBulkSubmitValues,
  hasBlankResetBulkValues,
  hasDirtyBulkFields,
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

  const getFieldState = useCallback(
    (field: TranslationField): BulkFieldState => getBulkFieldState(field, values[field.name]),
    [values],
  );

  const hasDirtyFields = useMemo(() => hasDirtyBulkFields(sections, values), [sections, values]);

  /** Stored blanks that bulk save resets; they enable saving but are not unsaved edits. */
  const hasBlankResets = useMemo(
    () => hasBlankResetBulkValues(sections, values),
    [sections, values],
  );

  const getBulkSaveValues = useCallback(
    (): BulkTranslationValue[] => [
      ...getDirtyBulkSubmitValues(sections, values),
      ...getBlankResetBulkValues(sections, values),
    ],
    [sections, values],
  );

  return {
    clearFieldValues,
    getBulkSaveValues,
    getFieldState,
    handleValueChange,
    hasBlankResets,
    hasDirtyFields,
    resetValues,
  };
}
