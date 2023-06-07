import { MetadataInput } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { removeAtIndex, updateAtIndex } from "@dashboard/utils/lists";
import { Box } from "@saleor/macaw-ui/next";
import React, { memo } from "react";

import { MetadataCard, MetadataCardProps } from "./MetadataCard";
import { EventDataAction, EventDataField } from "./types";
import { getDataKey, parseEventData } from "./utils";

export interface MetadataProps
  extends Omit<MetadataCardProps, "data" | "isPrivate"> {
  data: Record<"metadata" | "privateMetadata", MetadataInput[]>;
  isLoading?: boolean;
}

const propsCompare = (_, newProps: MetadataProps) => {
  /**
    If we pass `isLoading` render only when the loading finishes
  */
  if (typeof newProps.isLoading !== "undefined") {
    return newProps.isLoading;
  }

  /*
    If `isLoading` is not present, keep the old behavior
  */
  return false;
};

export const Metadata: React.FC<MetadataProps> = memo(({ data, onChange }) => {
  const change = (event: ChangeEvent, isPrivate: boolean) => {
    const { action, field, fieldIndex, value } = parseEventData(event);
    const key = getDataKey(isPrivate);
    const dataToUpdate = data[key];

    onChange({
      target: {
        name: key,
        value:
          action === EventDataAction.update
            ? updateAtIndex(
                {
                  ...dataToUpdate[fieldIndex],
                  key:
                    field === EventDataField.name
                      ? value
                      : dataToUpdate[fieldIndex].key,
                  value:
                    field === EventDataField.value
                      ? value
                      : dataToUpdate[fieldIndex].value,
                },
                dataToUpdate,
                fieldIndex,
              )
            : action === EventDataAction.add
            ? [
                ...dataToUpdate,
                {
                  key: "",
                  value: "",
                },
              ]
            : removeAtIndex(dataToUpdate, fieldIndex),
      },
    });
  };

  return (
    <Box display="grid" gap={2} paddingBottom={6}>
      <MetadataCard
        data={data?.metadata}
        isPrivate={false}
        onChange={event => change(event, false)}
      />
      <MetadataCard
        data={data?.privateMetadata}
        isPrivate={true}
        onChange={event => change(event, true)}
      />
    </Box>
  );
}, propsCompare);
