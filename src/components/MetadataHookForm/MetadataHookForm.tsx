import { MetadataInput } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { UseFormReturn } from "react-hook-form";

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
  readonly?: boolean;
  // This props is used to hide the private metadata section when user doesn't have enough permissions.
  hidePrivateMetadata?: boolean;
}

export const MetadataHookForm = ({
  isLoading,
  readonly = false,
  hidePrivateMetadata = false,
  control,
  getValues,
  trigger,
}: MetadataProps) => {
  const {
    metadataFields,
    privateMetadataFields,
    handleMetadataChange,
    handlePrivateMetadataChange,
  } = useMetadataFormControls({ control, trigger, getValues });

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
        readonly={readonly}
        onChange={handleMetadataChange}
      />
      {(privateMetadataFields || !hidePrivateMetadata) && (
        <MetadataCard
          data={privateMetadataFields}
          isPrivate={true}
          readonly={readonly}
          onChange={handlePrivateMetadataChange}
        />
      )}
    </Box>
  );
};
