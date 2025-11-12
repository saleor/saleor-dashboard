import { MetadataFormData } from "@dashboard/components/Metadata";
import { EventDataAction, EventDataField } from "@dashboard/components/Metadata/types";
import { getDataKey, parseEventData } from "@dashboard/components/Metadata/utils";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { flattenErrors } from "@dashboard/utils/hook-form/errors";
import { useMemo } from "react";
import { FieldArrayPath, FieldError, useFieldArray, UseFormReturn } from "react-hook-form";
import { useIntl } from "react-intl";

import { getValidateMetadata } from "./utils";

type UseMetadataFormControlsParams = Pick<
  UseFormReturn<MetadataFormData>,
  "control" | "trigger" | "getValues" | "formState"
>;

export const useMetadataFormControls = ({
  control,
  trigger,
  getValues,
  formState,
}: UseMetadataFormControlsParams) => {
  const intl = useIntl();

  // Metadata field arrays
  const metadataControls = useFieldArray<MetadataFormData>({
    control,
    name: "metadata" as FieldArrayPath<MetadataFormData>,
    rules: {
      validate: getValidateMetadata(intl),
    },
  });

  const privateMetadataControls = useFieldArray<MetadataFormData>({
    control,
    name: "privateMetadata" as FieldArrayPath<MetadataFormData>,
    rules: {
      validate: getValidateMetadata(intl),
    },
  });

  // Create change handler factory
  const getHandleChange = (type: "metadata" | "privateMetadata") => {
    return (event: ChangeEvent) => {
      const { action, field, fieldIndex, value } = parseEventData(event);

      const metadataType = getDataKey(type === "privateMetadata"); // isPrivate parameter
      const fieldObjKey = field === EventDataField.name ? "key" : "value";
      const calledMetadataControls =
        type === "metadata" ? metadataControls : privateMetadataControls;

      if (action === EventDataAction.update && typeof fieldIndex === "number") {
        // Note: form.setValue cannot be used, because it doesn't trigger a re-render
        // Get the existing value at the specific index in the field array
        const existingValue = getValues(`${metadataType}.${fieldIndex}`);

        // Update the field with the new value while preserving other properties
        calledMetadataControls.update(fieldIndex, {
          ...existingValue,
          [fieldObjKey]: value,
        });

        // Trigger re-validation of data at the parent path
        trigger(metadataType);
      }

      if (action === EventDataAction.add) {
        calledMetadataControls.append({ key: "", value: "" });
      }

      if (action === EventDataAction.delete && typeof fieldIndex === "number") {
        calledMetadataControls.remove(fieldIndex);
      }
    };
  };

  // Change handlers
  const handleMetadataChange = getHandleChange("metadata");
  const handlePrivateMetadataChange = getHandleChange("privateMetadata");

  // Error handling
  const metadataErrors = useMemo(
    () => flattenErrors(formState.errors.metadata as FieldError),
    [formState.errors.metadata],
  );
  const privateMetadataErrors = useMemo(
    () => flattenErrors(formState.errors.privateMetadata as FieldError),
    [formState.errors.privateMetadata],
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
