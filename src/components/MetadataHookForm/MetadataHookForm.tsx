import { MetadataInput } from "@dashboard/graphql";
import { flattenErrors } from "@dashboard/utils/hook-form/errors";
import { Box } from "@saleor/macaw-ui-next";
import React, { useMemo } from "react";
import { FieldError, FieldErrors, UseFormReturn } from "react-hook-form";

import { MetadataCard, MetadataCardProps } from "../Metadata/MetadataCard";
import { MetadataLoadingCard } from "../Metadata/MetadataLoadingCard";
import { useMetadataFormControls } from "./useMetadataFormControls";

type Data = {
  metadata: MetadataInput[];
  privateMetadata: MetadataInput[];
};

export interface MetadataProps
  extends Omit<MetadataCardProps, "data" | "isPrivate" | "onChange">,
    Pick<UseFormReturn<Data>, "getValues" | "control" | "trigger"> {
  isLoading?: boolean;
  disabled?: boolean;
  // This props is used to hide the private metadata section when user doesn't have enough permissions.
  hidePrivateMetadata?: boolean;
  formErrors: FieldErrors<Data>;
}

/** Displays controls for `metadata` and `privateMetadata` fields used with react-hook-form useForm
 * Values must be named exactly `metadata` and `privateMetadata`
 * Example: see OrderMetadataDialog */
export const MetadataHookForm = ({
  isLoading,
  disabled,
  hidePrivateMetadata = false,
  control,
  getValues,
  trigger,
  formErrors,
}: MetadataProps) => {
  const {
    metadataFields,
    privateMetadataFields,
    handleMetadataChange,
    handlePrivateMetadataChange,
  } = useMetadataFormControls({ control, trigger, getValues });

  const metadataErrors = useMemo(
    () => flattenErrors(formErrors.metadata as FieldError),
    [formErrors.metadata],
  );
  const privateMetadataErrors = useMemo(
    () => flattenErrors(formErrors.privateMetadata as FieldError),
    [formErrors.privateMetadata],
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
        data={metadataFields}
        isPrivate={false}
        disabled={disabled}
        onChange={handleMetadataChange}
        error={metadataErrors.length ? metadataErrors.join(", ") : undefined}
      />

      {privateMetadataFields && !hidePrivateMetadata && (
        <MetadataCard
          data={privateMetadataFields}
          isPrivate={true}
          disabled={disabled}
          onChange={handlePrivateMetadataChange}
          error={privateMetadataErrors.length ? privateMetadataErrors.join(", ") : undefined}
        />
      )}
    </Box>
  );
};
