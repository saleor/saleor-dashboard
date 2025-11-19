import { EventDataAction, EventDataField } from "@dashboard/components/Metadata/types";
import { getDataKey, parseEventData } from "@dashboard/components/Metadata/utils";
import { MetadataInput } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { flattenErrors } from "@dashboard/utils/hook-form/errors";
import { useMemo } from "react";
import {
  Control,
  FieldArray,
  FieldArrayPath,
  FieldPath,
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

type MetadataFieldArray = Array<{ id: string; key: string; value: string }>;

interface MetadataFormControlsReturn {
  metadataFields: MetadataFieldArray;
  privateMetadataFields: MetadataFieldArray;
  handleMetadataChange: (event: ChangeEvent) => void;
  handlePrivateMetadataChange: (event: ChangeEvent) => void;
  metadataErrors: string[];
  privateMetadataErrors: string[];
}

/**
 * Reusable hook for managing metadata form field arrays, change handlers, and validation errors.
 * Consolidates common metadata form logic used across Order, Fulfillment, and OrderLine metadata dialogs.
 *
 * **Features:**
 * - Manages metadata and privateMetadata field arrays
 * - Provides change handlers for add/update/delete operations
 * - Validates for duplicate and empty keys
 * - Flattens and exposes validation errors
 * - Supports both flat and nested form structures
 *
 * **Flat Structure Example** (Order/Fulfillment dialogs):
 * ```ts
 * const formMethods = useForm<MetadataFormData>({
 *   values: {
 *     metadata: [...],
 *     privateMetadata: [...]
 *   }
 * });
 *
 * const {
 *   metadataFields,
 *   privateMetadataFields,
 *   handleMetadataChange,
 *   handlePrivateMetadataChange,
 *   metadataErrors,
 *   privateMetadataErrors
 * } = useMetadataFormControls({
 *   control: formMethods.control,
 *   trigger: formMethods.trigger,
 *   getValues: formMethods.getValues,
 *   formState: formMethods.formState
 * });
 * ```
 *
 * **Nested Structure Example** (OrderLine dialog):
 * ```ts
 * interface NestedFormData {
 *   orderLine: MetadataFormData;
 *   variant: MetadataFormData;
 * }
 *
 * const formMethods = useForm<NestedFormData>({...});
 *
 * // For orderLine metadata
 * const orderLineControls = useMetadataFormControls({
 *   control: formMethods.control,
 *   trigger: formMethods.trigger,
 *   getValues: formMethods.getValues,
 *   formState: formMethods.formState,
 *   pathPrefix: "orderLine"  // Access orderLine.metadata
 * });
 *
 * // For variant metadata
 * const variantControls = useMetadataFormControls({
 *   ...formMethods,
 *   pathPrefix: "variant"  // Access variant.metadata
 * });
 * ```
 *
 * **Creating a New Metadata Dialog:**
 * ```ts
 * export const ProductMetadataDialog = ({ product, onClose }) => {
 *   const intl = useIntl();
 *   const { onSubmit, submitInProgress } = useHandleMetadataSubmit({
 *     initialData: product,
 *     onClose,
 *     refetchDocument: ProductDetailsDocument
 *   });
 *
 *   const formMethods = useForm<MetadataFormData>({
 *     values: {
 *       metadata: product?.metadata?.map(mapMetadataItemToInput) ?? [],
 *       privateMetadata: product?.privateMetadata?.map(mapMetadataItemToInput) ?? []
 *     }
 *   });
 *
 *   const {
 *     metadataFields,
 *     privateMetadataFields,
 *     handleMetadataChange,
 *     handlePrivateMetadataChange,
 *     metadataErrors,
 *     privateMetadataErrors
 *   } = useMetadataFormControls(formMethods);
 *
 *   return (
 *     <MetadataDialog
 *       open={true}
 *       onClose={onClose}
 *       onSave={() => onSubmit(formMethods.getValues())}
 *       title={intl.formatMessage({ defaultMessage: "Product Metadata" })}
 *       data={{
 *         metadata: mapFieldArrayToMetadataInput(metadataFields),
 *         privateMetadata: mapFieldArrayToMetadataInput(privateMetadataFields)
 *       }}
 *       onChange={(event, isPrivate) =>
 *         isPrivate ? handlePrivateMetadataChange(event) : handleMetadataChange(event)
 *       }
 *       loading={submitInProgress}
 *       errors={{
 *         metadata: metadataErrors.join(", "),
 *         privateMetadata: privateMetadataErrors.join(", ")
 *       }}
 *       formIsDirty={formMethods.formState.isDirty}
 *     />
 *   );
 * };
 * ```
 *
 * @param config - Form control configuration
 * @param config.control - React Hook Form control instance
 * @param config.trigger - Form field validation trigger function
 * @param config.getValues - Function to get current form values
 * @param config.formState - Current form state (for error tracking)
 * @param config.pathPrefix - Optional prefix for nested structures (e.g., "orderLine")
 *
 * @returns Object containing field arrays, change handlers, and error arrays
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
  const metadataControls = useFieldArray({
    control,
    name: metadataPath as FieldArrayPath<TFormData>,
    rules: {
      validate: (value: unknown) => getValidateMetadata(intl)(value as MetadataInput[]),
    },
  });

  const privateMetadataControls = useFieldArray({
    control,
    name: privateMetadataPath as FieldArrayPath<TFormData>,
    rules: {
      validate: (value: unknown) => getValidateMetadata(intl)(value as MetadataInput[]),
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
        const existingValue = getValues(`${fieldPath}.${fieldIndex}` as FieldPath<TFormData>);

        // Update the field with the new value while preserving other properties
        calledMetadataControls.update(fieldIndex, {
          ...(existingValue as MetadataInput),
          [fieldObjKey]: value,
        } as FieldArray<TFormData>);

        // Trigger re-validation of data at the parent path
        trigger(fieldPath as FieldPath<TFormData>);
      }

      if (action === EventDataAction.add) {
        calledMetadataControls.append({ key: "", value: "" } as FieldArray<TFormData>);
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
    ? (formState.errors as Record<string, any>)?.[pathPrefix]?.metadata
    : formState.errors.metadata;
  const privateMetadataErrorsRaw = pathPrefix
    ? (formState.errors as Record<string, any>)?.[pathPrefix]?.privateMetadata
    : formState.errors.privateMetadata;

  const metadataErrors = useMemo(() => flattenErrors(metadataErrorsRaw), [metadataErrorsRaw]);

  const privateMetadataErrors = useMemo(
    () => flattenErrors(privateMetadataErrorsRaw),
    [privateMetadataErrorsRaw],
  );

  return {
    metadataFields: metadataControls.fields as unknown as MetadataFieldArray,
    privateMetadataFields: privateMetadataControls.fields as unknown as MetadataFieldArray,
    handleMetadataChange,
    handlePrivateMetadataChange,
    metadataErrors,
    privateMetadataErrors,
  };
};
