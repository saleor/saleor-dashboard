import { MetadataInput } from "@saleor/graphql";
import { ChangeEvent } from "@saleor/hooks/useForm";
import { removeAtIndex, updateAtIndex } from "@saleor/utils/lists";
import React from "react";

import CardSpacer from "../CardSpacer";
import MetadataCard, { MetadataCardProps } from "./MetadataCard";
import { EventDataAction, EventDataField } from "./types";
import { getDataKey, parseEventData } from "./utils";

export interface MetadataProps
  extends Omit<MetadataCardProps, "data" | "isPrivate"> {
  data: Record<"metadata" | "privateMetadata", MetadataInput[]>;
}

const Metadata: React.FC<MetadataProps> = ({ data, onChange }) => {
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
    <>
      <MetadataCard
        data={data?.metadata}
        isPrivate={false}
        onChange={event => change(event, false)}
      />
      <CardSpacer />
      <MetadataCard
        data={data?.privateMetadata}
        isPrivate={true}
        onChange={event => change(event, true)}
      />
    </>
  );
};

Metadata.displayName = "Metadata";
export default Metadata;
