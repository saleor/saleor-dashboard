import {
  getDirtyBulkSubmitValues,
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

  const hasDirtyFields = useMemo(() => hasDirtyBulkFields(sections, values), [sections, values]);

  const getDirtyValues = useCallback(
    (): BulkTranslationValue[] => getDirtyBulkSubmitValues(sections, values),
    [sections, values],
  );

  return {
    getDirtyValues,
    handleValueChange,
    hasDirtyFields,
    resetValues,
  };
}
