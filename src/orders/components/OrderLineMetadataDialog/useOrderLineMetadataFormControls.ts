import { EventDataAction, EventDataField } from "@dashboard/components/Metadata/types";
import { getDataKey, parseEventData } from "@dashboard/components/Metadata/utils";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { flattenErrors } from "@dashboard/utils/hook-form/errors";
import { useMemo } from "react";
import { FieldArrayPath, FieldError, useFieldArray, UseFormReturn } from "react-hook-form";
import { useIntl } from "react-intl";

import { OrderLineAndVariantMetadataFormData } from "./OrderLineMetadataDialog";
import { getValidateMetadata } from "./utils";

type UseOrderLineMetadataFormControlsParams = Pick<
  UseFormReturn<OrderLineAndVariantMetadataFormData>,
  "control" | "trigger" | "getValues" | "formState"
>;

export const useOrderLineMetadataFormControls = ({
  control,
  trigger,
  getValues,
  formState,
}: UseOrderLineMetadataFormControlsParams) => {
  const intl = useIntl();

  // Order Line metadata field arrays
  const orderLineMetadataControls = useFieldArray<OrderLineAndVariantMetadataFormData>({
    control,
    name: "orderLine.metadata" as FieldArrayPath<OrderLineAndVariantMetadataFormData>,
    rules: {
      validate: getValidateMetadata(intl),
    },
  });

  const orderLinePrivateMetadataControls = useFieldArray<OrderLineAndVariantMetadataFormData>({
    control,
    name: "orderLine.privateMetadata" as FieldArrayPath<OrderLineAndVariantMetadataFormData>,
    rules: {
      validate: getValidateMetadata(intl),
    },
  });

  // Variant metadata field arrays
  const variantMetadataControls = useFieldArray<OrderLineAndVariantMetadataFormData>({
    control,
    name: "variant.metadata" as FieldArrayPath<OrderLineAndVariantMetadataFormData>,
    rules: {
      validate: getValidateMetadata(intl),
    },
  });

  const variantPrivateMetadataControls = useFieldArray<OrderLineAndVariantMetadataFormData>({
    control,
    name: "variant.privateMetadata" as FieldArrayPath<OrderLineAndVariantMetadataFormData>,
    rules: {
      validate: getValidateMetadata(intl),
    },
  });

  // Map field controls for easy lookup
  const controlsMap = {
    orderLine: {
      metadata: orderLineMetadataControls,
      privateMetadata: orderLinePrivateMetadataControls,
    },
    variant: {
      metadata: variantMetadataControls,
      privateMetadata: variantPrivateMetadataControls,
    },
  };

  // Create change handler factory
  const getHandleChange = ({
    fieldPrefix,
    type,
  }: {
    fieldPrefix: "orderLine" | "variant";
    type: "metadata" | "privateMetadata";
  }) => {
    return (event: ChangeEvent) => {
      const { action, field, fieldIndex, value } = parseEventData(event);

      const metadataType = getDataKey(type === "privateMetadata"); // isPrivate parameter
      const fieldObjKey = field === EventDataField.name ? "key" : "value";
      const calledMetadataControls = controlsMap[fieldPrefix][metadataType];

      if (action === EventDataAction.update && typeof fieldIndex === "number") {
        // Note: form.setValue cannot be used, because it doesn't trigger a re-render
        // Get the existing value at the specific index in the field array
        const existingValue = getValues(`${fieldPrefix}.${metadataType}.${fieldIndex}`);

        // Update the field with the new value while preserving other properties
        calledMetadataControls.update(fieldIndex, {
          ...existingValue,
          [fieldObjKey]: value,
        });

        // Trigger re-validation of data at the parent path
        trigger(`${fieldPrefix}.${metadataType}`);
      }

      if (action === EventDataAction.add) {
        calledMetadataControls.append({ key: "", value: "" });
      }

      if (action === EventDataAction.delete && typeof fieldIndex === "number") {
        calledMetadataControls.remove(fieldIndex);
      }
    };
  };

  // Order Line change handlers
  const handleOrderLineMetadataChange = getHandleChange({
    fieldPrefix: "orderLine",
    type: "metadata",
  });
  const handleOrderLinePrivateMetadataChange = getHandleChange({
    fieldPrefix: "orderLine",
    type: "privateMetadata",
  });

  // Variant change handlers
  const handleVariantMetadataChange = getHandleChange({
    fieldPrefix: "variant",
    type: "metadata",
  });
  const handleVariantPrivateMetadataChange = getHandleChange({
    fieldPrefix: "variant",
    type: "privateMetadata",
  });

  // Error handling
  const orderLineMetadataErrors = useMemo(
    () => flattenErrors(formState.errors.orderLine?.metadata as FieldError),
    [formState.errors.orderLine?.metadata],
  );
  const orderLinePrivateMetadataErrors = useMemo(
    () => flattenErrors(formState.errors.orderLine?.privateMetadata as FieldError),
    [formState.errors.orderLine?.privateMetadata],
  );
  const variantMetadataErrors = useMemo(
    () => flattenErrors(formState.errors.variant?.metadata as FieldError),
    [formState.errors.variant?.metadata],
  );
  const variantPrivateMetadataErrors = useMemo(
    () => flattenErrors(formState.errors.variant?.privateMetadata as FieldError),
    [formState.errors.variant?.privateMetadata],
  );

  return {
    orderLineMetadataFields: orderLineMetadataControls.fields,
    orderLinePrivateMetadataFields: orderLinePrivateMetadataControls.fields,
    variantMetadataFields: variantMetadataControls.fields,
    variantPrivateMetadataFields: variantPrivateMetadataControls.fields,
    handleOrderLineMetadataChange,
    handleOrderLinePrivateMetadataChange,
    handleVariantMetadataChange,
    handleVariantPrivateMetadataChange,
    orderLineMetadataErrors,
    orderLinePrivateMetadataErrors,
    variantMetadataErrors,
    variantPrivateMetadataErrors,
  };
};
