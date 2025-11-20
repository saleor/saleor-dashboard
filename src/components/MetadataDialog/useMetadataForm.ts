import { MetadataFormData } from "@dashboard/components/Metadata";
import { EventDataAction, EventDataField } from "@dashboard/components/Metadata/types";
import { getDataKey, parseEventData } from "@dashboard/components/Metadata/utils";
import { MetadataInput, MetadataItemFragment } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { flattenErrors } from "@dashboard/utils/hook-form/errors";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import { useMemo } from "react";
import { FieldError, useFieldArray, useForm, UseFormReset } from "react-hook-form";
import { useIntl } from "react-intl";

import { getValidateMetadata } from "./validation";

interface UseMetadataFormConfig {
  graphqlData:
    | {
        metadata: MetadataItemFragment[];
        privateMetadata: MetadataItemFragment[];
      }
    | undefined;
  submitInProgress: boolean;
  lastSubmittedData: MetadataFormData | undefined;
}

type MetadataFieldArray = Array<{ id: string; key: string; value: string }>;

interface MetadataFormReturn {
  metadataFields: MetadataFieldArray;
  privateMetadataFields: MetadataFieldArray;
  metadataErrors: string[];
  privateMetadataErrors: string[];
  reset: UseFormReset<MetadataFormData>;
  formIsDirty: boolean;
  handleChange: (event: ChangeEvent, isPrivate: boolean) => void;
  formData: MetadataFormData;
}

export const useMetadataForm = ({
  graphqlData,
  submitInProgress,
  lastSubmittedData,
}: UseMetadataFormConfig): MetadataFormReturn => {
  const intl = useIntl();

  const formMethods = useForm<MetadataFormData>({
    values: submitInProgress
      ? lastSubmittedData
      : {
          metadata: (graphqlData?.metadata ?? []).map(mapMetadataItemToInput),
          privateMetadata: (graphqlData?.privateMetadata ?? []).map(mapMetadataItemToInput),
        },
  });

  const { control, getValues, formState, trigger, reset } = formMethods;

  const metadataControls = useFieldArray({
    control,
    name: "metadata",
    rules: {
      validate: value => getValidateMetadata(intl)(value),
    },
  });

  const privateMetadataControls = useFieldArray({
    control,
    name: "privateMetadata",
    rules: {
      validate: value => getValidateMetadata(intl)(value),
    },
  });

  const controlsMap = {
    metadata: metadataControls,
    privateMetadata: privateMetadataControls,
  };

  const getHandleChange = (type: "metadata" | "privateMetadata") => {
    return (event: ChangeEvent) => {
      const { action, field, fieldIndex, value } = parseEventData(event);

      const metadataType = getDataKey(type === "privateMetadata"); // isPrivate parameter
      const fieldObjKey = field === EventDataField.name ? "key" : "value";
      const calledMetadataControls = controlsMap[metadataType];

      if (action === EventDataAction.update && typeof fieldIndex === "number") {
        // Note: form.setValue cannot be used, because it doesn't trigger a re-render
        // Get the existing value at the specific index in the field array
        const existingValue = getValues(`${metadataType}.${fieldIndex}`);

        // Update the field with the new value while preserving other properties
        calledMetadataControls.update(fieldIndex, {
          ...(existingValue as MetadataInput),
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

  const handleMetadataChange = getHandleChange("metadata");
  const handlePrivateMetadataChange = getHandleChange("privateMetadata");

  const metadataErrors = useMemo(
    () => flattenErrors(formState.errors.metadata as FieldError),
    [formState.errors.metadata],
  );

  const privateMetadataErrors = useMemo(
    () => flattenErrors(formState.errors.privateMetadata as FieldError),
    [formState.errors.privateMetadata],
  );

  const handleChange = (event: ChangeEvent, isPrivate: boolean) => {
    if (isPrivate) {
      handlePrivateMetadataChange(event);
    } else {
      handleMetadataChange(event);
    }
  };

  return {
    metadataFields: metadataControls.fields,
    privateMetadataFields: privateMetadataControls.fields,
    metadataErrors,
    privateMetadataErrors,
    reset,
    formIsDirty: formState.isDirty,
    handleChange,
    formData: getValues(),
  };
};
