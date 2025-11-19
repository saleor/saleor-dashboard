import { MetadataFormData } from "@dashboard/components/Metadata";
import { EventDataAction, EventDataField } from "@dashboard/components/Metadata/types";
import { getDataKey, parseEventData } from "@dashboard/components/Metadata/utils";
import { MetadataDialog } from "@dashboard/components/MetadataDialog/MetadataDialog";
import { useHandleMetadataSubmit } from "@dashboard/components/MetadataDialog/useHandleMetadataSubmit";
import { MetadataInput, OrderDetailsDocument, OrderDetailsFragment } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { flattenErrors } from "@dashboard/utils/hook-form/errors";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import { useEffect, useMemo } from "react";
import { FieldArrayPath, FieldError, useFieldArray, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

export type FulfillmentMetadataDialogData = OrderDetailsFragment["fulfillments"][0];

interface OrderFulfillmentMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  fulfillment: FulfillmentMetadataDialogData | undefined;
}

const getValidateMetadata =
  (intl: ReturnType<typeof useIntl>) =>
  (metadata: MetadataInput[]): true | string => {
    const keys = metadata.map(entry => entry.key);
    const uniqueKeys = new Set(keys);

    if (uniqueKeys.size !== keys.length) {
      return intl.formatMessage({
        defaultMessage: "Metadata keys must be unique, remove duplicate key",
        description: "metadata edit form, error message",
        id: "MfWHGz",
      });
    }

    if (keys.some(key => key === "")) {
      return intl.formatMessage({
        defaultMessage: "Metadata key cannot be empty",
        description: "metadata edit form, error message",
        id: "lb5uDM",
      });
    }

    return true;
  };

const mapFieldArrayToMetadataInput = (
  fields: Array<Record<"id", string> & MetadataInput>,
): MetadataInput[] => {
  return fields.map(field => ({
    key: field.key,
    value: field.value,
  }));
};

export const OrderFulfillmentMetadataDialog = ({
  onClose,
  open,
  fulfillment,
}: OrderFulfillmentMetadataDialogProps) => {
  const intl = useIntl();
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleMetadataSubmit({
    initialData: fulfillment,
    onClose,
    refetchDocument: OrderDetailsDocument,
  });

  const formMethods = useForm<MetadataFormData>({
    // Display last submitted data while re-fetching to avoid flicker on UI
    values: submitInProgress
      ? lastSubmittedData
      : {
          // Removes __typename from metadata item object
          metadata: (fulfillment?.metadata ?? []).map(mapMetadataItemToInput),
          privateMetadata: (fulfillment?.privateMetadata ?? []).map(mapMetadataItemToInput),
        },
  });

  const { control, getValues, formState, trigger, reset } = formMethods;

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
  const handleChange = (event: ChangeEvent, isPrivate: boolean) => {
    const handler = getHandleChange(isPrivate ? "privateMetadata" : "metadata");

    handler(event);
  };

  // Error handling
  const metadataErrors = useMemo(
    () => flattenErrors(formState.errors.metadata as FieldError),
    [formState.errors.metadata],
  );
  const privateMetadataErrors = useMemo(
    () => flattenErrors(formState.errors.privateMetadata as FieldError),
    [formState.errors.privateMetadata],
  );

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const handleSave = async () => {
    const formData = getValues();

    await onSubmit(formData);
  };

  return (
    <MetadataDialog
      open={open}
      onClose={onClose}
      onSave={handleSave}
      title={intl.formatMessage({
        defaultMessage: "Fulfillment Metadata",
        id: "lDdWo9",
      })}
      data={{
        metadata: mapFieldArrayToMetadataInput(metadataControls.fields),
        privateMetadata: mapFieldArrayToMetadataInput(privateMetadataControls.fields),
      }}
      onChange={handleChange}
      loading={submitInProgress}
      errors={{
        metadata: metadataErrors.length ? metadataErrors.join(", ") : undefined,
        privateMetadata: privateMetadataErrors.length
          ? privateMetadataErrors.join(", ")
          : undefined,
      }}
      formIsDirty={formState.isDirty}
    />
  );
};
