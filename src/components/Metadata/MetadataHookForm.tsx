import { MetadataInput } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";

import { MetadataCard, MetadataCardProps } from "./MetadataCard";
import { MetadataLoadingCard } from "./MetadataLoadingCard";
import { EventDataAction, EventDataField } from "./types";
import { getDataKey, parseEventData } from "./utils";

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

const validateDuplicateKeys = (metadata: MetadataInput[]): true | string => {
  const keys = metadata.map(entry => entry.key);
  const uniqueKeys = new Set(keys);

  return uniqueKeys.size !== keys.length
    ? "Metadata keys must be unique, remove duplicate key"
    : true;
};

export const MetadataHookForm = ({
  isLoading,
  readonly = false,
  hidePrivateMetadata = false,
  control,
  getValues,
  trigger,
}: MetadataProps) => {
  const metadataControls = useFieldArray<Data>({
    control,
    name: "metadata",
    rules: {
      validate: validateDuplicateKeys,
    },
  });

  const privateMetadataControls = useFieldArray<Data>({
    control,
    name: "privateMetadata",
    rules: {
      validate: validateDuplicateKeys,
    },
  });

  const change = (event: ChangeEvent, isPrivate: boolean) => {
    const { action, field, fieldIndex, value } = parseEventData(event);

    const metadataType = getDataKey(isPrivate);
    const fieldObjKey = field === EventDataField.name ? "key" : "value";
    const calledMetadataControls =
      metadataType === "metadata" ? metadataControls : privateMetadataControls;

    if (action === EventDataAction.update && typeof fieldIndex === "number") {
      // Note: form.setValue cannot be used, because it doesn't trigger a re-render
      const existingValue = getValues(`${metadataType}.${fieldIndex}`);

      calledMetadataControls.update(fieldIndex, { ...existingValue, [fieldObjKey]: value });

      // Trigger re-validation of data
      trigger(metadataType);
    }

    if (action === EventDataAction.add) {
      calledMetadataControls.append({ key: "", value: "" });
    }

    if (action === EventDataAction.delete && typeof fieldIndex === "number") {
      calledMetadataControls.remove(fieldIndex);
    }
  };

  return (
    <Box display="grid" gap={2}>
      {isLoading ? (
        <>
          <MetadataLoadingCard />
          {!hidePrivateMetadata && <MetadataLoadingCard isPrivate />}
        </>
      ) : (
        <>
          <MetadataCard
            data={metadataControls.fields}
            isPrivate={false}
            readonly={readonly}
            onChange={event => change(event, false)}
          />
          {(privateMetadataControls.fields || !hidePrivateMetadata) && (
            <MetadataCard
              data={privateMetadataControls.fields}
              isPrivate={true}
              readonly={readonly}
              onChange={event => change(event, true)}
            />
          )}
        </>
      )}
    </Box>
  );
};
