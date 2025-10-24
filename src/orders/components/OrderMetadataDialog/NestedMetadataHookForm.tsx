import { MetadataInput } from "@dashboard/graphql";
import { MetadataCard, MetadataCardProps } from "@dashboard/components/Metadata/MetadataCard";
import { MetadataLoadingCard } from "@dashboard/components/Metadata/MetadataLoadingCard";
import { flattenErrors } from "@dashboard/utils/hook-form/errors";
import { Box } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { FieldArrayWithId, FieldError, FieldErrors, UseFormReturn } from "react-hook-form";

import { OrderAndVariantMetadataFormData } from "./OrderMetadataDialog";
import { useNestedMetadataFormControls } from "./useNestedMetadataFormControls";

/**
 * Maps FieldArrayWithId to MetadataInput by extracting only key and value properties.
 * FieldArrayWithId includes an 'id' field used by react-hook-form for tracking,
 * but MetadataInput only needs key and value.
 */
const mapFieldArrayToMetadataInput = (
  fields: Array<Record<"id", string> & MetadataInput>,
): MetadataInput[] => {
  return fields.map(field => ({
    key: field.key,
    value: field.value,
  }));
};

interface NestedMetadataHookFormProps
  extends Omit<MetadataCardProps, "data" | "isPrivate" | "onChange">,
    Pick<UseFormReturn<OrderAndVariantMetadataFormData>, "getValues" | "control" | "trigger"> {
  isLoading?: boolean;
  disabled?: boolean;
  hidePrivateMetadata?: boolean;
  formErrors: FieldErrors<OrderAndVariantMetadataFormData>;
  fieldPrefix: "orderLine" | "variant";
}

export const NestedMetadataHookForm = ({
  isLoading,
  disabled,
  hidePrivateMetadata = false,
  control,
  getValues,
  trigger,
  formErrors,
  fieldPrefix,
}: NestedMetadataHookFormProps) => {
  const {
    metadataFields,
    privateMetadataFields,
    handleMetadataChange,
    handlePrivateMetadataChange,
  } = useNestedMetadataFormControls({ control, trigger, getValues, fieldPrefix });

  const fieldPrefixErrors = formErrors[fieldPrefix];
  const metadataErrors = useMemo(
    () => flattenErrors(fieldPrefixErrors?.metadata as FieldError),
    [fieldPrefixErrors?.metadata],
  );
  const privateMetadataErrors = useMemo(
    () => flattenErrors(fieldPrefixErrors?.privateMetadata as FieldError),
    [fieldPrefixErrors?.privateMetadata],
  );

  if (isLoading) {
    return (
      <Box display="grid" gap={2}>
        <MetadataLoadingCard />
        {!hidePrivateMetadata && <MetadataLoadingCard isPrivate />}
      </Box>
    );
  }

  return (
    <Box display="grid" gap={2}>
      <MetadataCard
        data={mapFieldArrayToMetadataInput(metadataFields)}
        isPrivate={false}
        disabled={disabled}
        onChange={handleMetadataChange}
        error={metadataErrors.length ? metadataErrors.join(", ") : undefined}
      />

      {privateMetadataFields && !hidePrivateMetadata && (
        <MetadataCard
          data={mapFieldArrayToMetadataInput(privateMetadataFields)}
          isPrivate={true}
          disabled={disabled}
          onChange={handlePrivateMetadataChange}
          error={privateMetadataErrors.length ? privateMetadataErrors.join(", ") : undefined}
        />
      )}
    </Box>
  );
};
