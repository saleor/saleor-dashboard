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
  FieldError,
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

export const useMetadataFormControls = <TFormData extends FieldValues>({
  control,
  trigger,
  getValues,
  formState,
}: UseMetadataFormControlsConfig<TFormData>): MetadataFormControlsReturn => {
  const intl = useIntl();

  // Metadata field arrays
  const metadataControls = useFieldArray({
    control,
    name: "metadata" as FieldArrayPath<TFormData>,
    rules: {
      validate: (value: unknown) => getValidateMetadata(intl)(value as MetadataInput[]),
    },
  });

  const privateMetadataControls = useFieldArray({
    control,
    name: "privateMetadata" as FieldArrayPath<TFormData>,
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

      if (action === EventDataAction.update && typeof fieldIndex === "number") {
        // Note: form.setValue cannot be used, because it doesn't trigger a re-render
        // Get the existing value at the specific index in the field array
        const existingValue = getValues(`${metadataType}.${fieldIndex}` as FieldPath<TFormData>);

        // Update the field with the new value while preserving other properties
        calledMetadataControls.update(fieldIndex, {
          ...(existingValue as MetadataInput),
          [fieldObjKey]: value,
        } as FieldArray<TFormData>);

        // Trigger re-validation of data at the parent path
        trigger(metadataType as FieldPath<TFormData>);
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
    metadataFields: metadataControls.fields as unknown as MetadataFieldArray,
    privateMetadataFields: privateMetadataControls.fields as unknown as MetadataFieldArray,
    handleMetadataChange,
    handlePrivateMetadataChange,
    metadataErrors,
    privateMetadataErrors,
  };
};
