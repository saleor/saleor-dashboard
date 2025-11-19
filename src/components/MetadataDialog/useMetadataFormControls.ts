import { EventDataAction, EventDataField } from "@dashboard/components/Metadata/types";
import { getDataKey, parseEventData } from "@dashboard/components/Metadata/utils";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { flattenErrors } from "@dashboard/utils/hook-form/errors";
import { useMemo } from "react";
import {
  Control,
  FieldArrayPath,
  FieldError,
  FieldValues,
  FormState,
  useFieldArray,
  UseFormGetValues,
  UseFormTrigger,
} from "react-hook-form";
import { useIntl } from "react-intl";

import { getValidateMetadata } from "./validation";

interface UseMetadataFormControlsConfig<TFormData extends FieldValues> {
  control: Control<TFormData>;
  trigger: UseFormTrigger<TFormData>;
  getValues: UseFormGetValues<TFormData>;
  formState: FormState<TFormData>;
  /**
   * Optional path prefix for nested form structures.
   * E.g., "orderLine" for accessing "orderLine.metadata"
   */
  pathPrefix?: string;
}

interface MetadataFormControlsReturn {
  metadataFields: any[];
  privateMetadataFields: any[];
  handleMetadataChange: (event: ChangeEvent) => void;
  handlePrivateMetadataChange: (event: ChangeEvent) => void;
  metadataErrors: string[];
  privateMetadataErrors: string[];
}

/**
 * Reusable hook for managing metadata form field arrays, change handlers, and validation errors.
 * Supports both flat form structures (metadata at root) and nested structures (e.g., orderLine.metadata).
 *
 * @example
 * // Flat structure (Order/Fulfillment dialogs)
 * const controls = useMetadataFormControls({ control, trigger, getValues, formState });
 *
 * @example
 * // Nested structure (OrderLine dialog)
 * const controls = useMetadataFormControls({
 *   control,
 *   trigger,
 *   getValues,
 *   formState,
 *   pathPrefix: "orderLine"
 * });
 */
export const useMetadataFormControls = <TFormData extends FieldValues>({
  control,
  trigger,
  getValues,
  formState,
  pathPrefix,
}: UseMetadataFormControlsConfig<TFormData>): MetadataFormControlsReturn => {
  const intl = useIntl();

  // Build field paths based on prefix
  const metadataPath = pathPrefix ? `${pathPrefix}.metadata` : "metadata";
  const privateMetadataPath = pathPrefix ? `${pathPrefix}.privateMetadata` : "privateMetadata";

  // Metadata field arrays
  const metadataControls = useFieldArray<TFormData>({
    control,
    name: metadataPath as FieldArrayPath<TFormData>,
    rules: {
      validate: getValidateMetadata(intl) as any,
    },
  });

  const privateMetadataControls = useFieldArray<TFormData>({
    control,
    name: privateMetadataPath as FieldArrayPath<TFormData>,
    rules: {
      validate: getValidateMetadata(intl) as any,
    },
  });

  // Map field controls for easy lookup
  const controlsMap = {
    metadata: metadataControls,
    privateMetadata: privateMetadataControls,
  };

  // Create change handler factory
  const getHandleChange = (type: "metadata" | "privateMetadata") => {
    return (event: ChangeEvent) => {
      const { action, field, fieldIndex, value } = parseEventData(event);

      const metadataType = getDataKey(type === "privateMetadata"); // isPrivate parameter
      const fieldObjKey = field === EventDataField.name ? "key" : "value";
      const calledMetadataControls = controlsMap[metadataType];
      const fieldPath = pathPrefix ? `${pathPrefix}.${metadataType}` : metadataType;

      if (action === EventDataAction.update && typeof fieldIndex === "number") {
        // Note: form.setValue cannot be used, because it doesn't trigger a re-render
        // Get the existing value at the specific index in the field array
        const existingValue = getValues(`${fieldPath}.${fieldIndex}` as any);

        // Update the field with the new value while preserving other properties
        calledMetadataControls.update(fieldIndex, {
          ...existingValue,
          [fieldObjKey]: value,
        } as any);

        // Trigger re-validation of data at the parent path
        trigger(fieldPath as any);
      }

      if (action === EventDataAction.add) {
        calledMetadataControls.append({ key: "", value: "" } as any);
      }

      if (action === EventDataAction.delete && typeof fieldIndex === "number") {
        calledMetadataControls.remove(fieldIndex);
      }
    };
  };

  // Change handlers
  const handleMetadataChange = getHandleChange("metadata");
  const handlePrivateMetadataChange = getHandleChange("privateMetadata");

  // Error handling - navigate through nested errors if pathPrefix exists
  const metadataErrorsRaw = pathPrefix
    ? (formState.errors as any)[pathPrefix]?.metadata
    : formState.errors.metadata;
  const privateMetadataErrorsRaw = pathPrefix
    ? (formState.errors as any)[pathPrefix]?.privateMetadata
    : formState.errors.privateMetadata;

  const metadataErrors = useMemo(
    () => flattenErrors(metadataErrorsRaw as FieldError),
    [metadataErrorsRaw],
  );

  const privateMetadataErrors = useMemo(
    () => flattenErrors(privateMetadataErrorsRaw as FieldError),
    [privateMetadataErrorsRaw],
  );

  return {
    metadataFields: metadataControls.fields,
    privateMetadataFields: privateMetadataControls.fields,
    handleMetadataChange,
    handlePrivateMetadataChange,
    metadataErrors,
    privateMetadataErrors,
  };
};
