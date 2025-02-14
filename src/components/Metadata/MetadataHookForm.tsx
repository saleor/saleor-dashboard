import { MetadataInput } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useController, UseControllerProps, useFieldArray, useFormContext } from "react-hook-form";

import { MetadataCard, MetadataCardProps } from "./MetadataCard";
import { MetadataLoadingCard } from "./MetadataLoadingCard";
import { EventDataAction, EventDataField } from "./types";
import { getDataKey, parseEventData } from "./utils";

type Data = {
  metadata: MetadataInput[];
  privateMetadata: MetadataInput[] | undefined;
};

export interface MetadataProps extends Omit<MetadataCardProps, "data" | "isPrivate" | "onChange"> {
  isLoading?: boolean;
  readonly?: boolean;
  // This props is used to hide the private metadata section when user doesn't have enough permissions.
  hidePrivateMetadata?: boolean;
}

export const MetadataHookForm = ({
  isLoading,
  readonly = false,
  hidePrivateMetadata = false,
}: MetadataProps) => {
  const { control, getValues } = useFormContext<Data>();

  const metadataControls = useFieldArray({
    control,
    name: "metadata",
  });

  const privateMetadataControls = useFieldArray({
    control,
    name: "privateMetadata",
  });

  const change = (event: ChangeEvent, isPrivate: boolean) => {
    const { action, field, fieldIndex, value } = parseEventData(event);

    const metadataType = getDataKey(isPrivate);
    const fieldObjKey = field === EventDataField.name ? "key" : "value";
    const calledMetadataControls =
      metadataType === "metadata" ? metadataControls : privateMetadataControls;

    if (action === EventDataAction.update) {
      // Note: form.setValue cannot be used, because it doesn't trigger a re-render
      const existingValue = getValues(`${metadataType}.${fieldIndex}`);

      calledMetadataControls.update(fieldIndex, { ...existingValue, [fieldObjKey]: value });
    }

    if (action === EventDataAction.add) {
      calledMetadataControls.append({ key: "", value: "" });
    }

    if (action === EventDataAction.delete) {
      calledMetadataControls.remove(fieldIndex);
    }
  };

  return (
    <Box display="grid" gap={2} paddingBottom={10}>
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
