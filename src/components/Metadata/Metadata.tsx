import { MetadataInput } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { removeAtIndex, updateAtIndex } from "@dashboard/utils/lists";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";

import { MetadataCard, MetadataCardProps } from "./MetadataCard";
import { EventDataAction, EventDataField } from "./types";
import { getDataKey, parseEventData } from "./utils";

export interface MetadataProps
  extends Omit<MetadataCardProps, "data" | "isPrivate"> {
  data: Record<"metadata" | "privateMetadata", MetadataInput[]>;
}

export const Metadata: React.FC<MetadataProps> = ({ data, onChange }) => {
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
    <Box display="grid" gap={5} paddingBottom={9}>
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
};
