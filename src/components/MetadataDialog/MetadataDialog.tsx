import { ButtonWithLoader } from "@dashboard/components/ButtonWithLoader/ButtonWithLoader";
import { MetadataFormData } from "@dashboard/components/Metadata";
import { MetadataCard } from "@dashboard/components/Metadata/MetadataCard";
import { EventDataAction, EventDataField } from "@dashboard/components/Metadata/types";
import { getDataKey, parseEventData } from "@dashboard/components/Metadata/utils";
import { DashboardModal } from "@dashboard/components/Modal";
import { MetadataInput } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import { flattenErrors } from "@dashboard/utils/hook-form/errors";
import { Box, Button } from "@saleor/macaw-ui-next";
import { useEffect, useMemo } from "react";
import { FieldArrayPath, FieldError, useFieldArray, useForm } from "react-hook-form";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";

export interface MetadataDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: MetadataFormData) => Promise<void>;
  title?: string;
  data: MetadataFormData;
  loading?: boolean;
}

const getValidateMetadata =
  (intl: IntlShape) =>
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

export const MetadataDialog = ({
  open,
  onClose,
  onSave,
  title,
  data,
  loading = false,
}: MetadataDialogProps) => {
  const intl = useIntl();

  const formMethods = useForm<MetadataFormData>({
    values: data,
  });

  const { handleSubmit, control, getValues, formState, trigger, reset } = formMethods;

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

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (formData: MetadataFormData) => {
    await onSave(formData);
  };

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="md" overflowY="hidden">
        <DashboardModal.Header paddingLeft={6}>
          {title ?? intl.formatMessage(commonMessages.metadata)}
        </DashboardModal.Header>

        {/* This is scroll container so that Save and title are always visible */}
        <Box
          style={{
            // Max height calculated so that there's no scroll on modal itself
            maxHeight: "calc(-320px + 100vh)",
            // Remove right margin (DashboardModal.Content has 6 units padding)
            // It has to be removed to avoid spacing out horizontal scroll in weird way
            marginRight: "calc(var(--mu-spacing-6) * -1)",
          }}
          // Re-add back removed padding via negative marginRight
          paddingRight={6}
          overflowY="auto"
        >
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" flexDirection="column" gap={2}>
              <MetadataCard
                data={mapFieldArrayToMetadataInput(metadataControls.fields)}
                isPrivate={false}
                disabled={loading}
                onChange={handleMetadataChange}
                error={metadataErrors.length ? metadataErrors.join(", ") : undefined}
              />

              <MetadataCard
                data={mapFieldArrayToMetadataInput(privateMetadataControls.fields)}
                isPrivate={true}
                disabled={loading}
                onChange={handlePrivateMetadataChange}
                error={privateMetadataErrors.length ? privateMetadataErrors.join(", ") : undefined}
              />
            </Box>
          </Box>
        </Box>

        <DashboardModal.Actions
          paddingTop={4}
          paddingX={6}
          bottom={6}
          width="100%"
          backgroundColor="default1"
        >
          <ButtonWithLoader
            transitionState={loading ? "loading" : "default"}
            data-test-id="save"
            variant="primary"
            disabled={loading || !formState.isDirty}
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            <FormattedMessage {...buttonMessages.save} />
          </ButtonWithLoader>
          <Button data-test-id="back" variant="secondary" onClick={onClose}>
            <FormattedMessage {...buttonMessages.close} />
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
