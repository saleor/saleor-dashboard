// @ts-strict-ignore
import { MetadataInput } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { removeAtIndex, updateAtIndex } from "@dashboard/utils/lists";
import { Box } from "@saleor/macaw-ui-next";
import { memo } from "react";

import { MetadataCard, MetadataCardProps } from "./MetadataCard";
import { MetadataLoadingCard } from "./MetadataLoadingCard";
import { EventDataAction, EventDataField } from "./types";
import { getDataKey, parseEventData } from "./utils";

export interface MetadataProps extends Omit<MetadataCardProps, "data" | "isPrivate"> {
  data: {
    metadata: MetadataInput[];
    privateMetadata: MetadataInput[] | undefined;
  };
  isLoading?: boolean;
  readonly?: boolean;
  // This props is used to hide the private metadata section when user doesn't have enough permissions.
  hidePrivateMetadata?: boolean;
}

// TODO: Refactor loading state logic
// TODO: Split "Metadata" component into "Metadata" and "PrivateMetadata" components
export const Metadata = memo(
  ({ data, onChange, isLoading, readonly = false, hidePrivateMetadata = false }: MetadataProps) => {
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
                    key: field === EventDataField.name ? value : dataToUpdate[fieldIndex].key,
                    value: field === EventDataField.value ? value : dataToUpdate[fieldIndex].value,
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
        {isLoading ? (
          <>
            <MetadataLoadingCard />
            {!hidePrivateMetadata && <MetadataLoadingCard isPrivate />}
          </>
        ) : (
          <>
            <MetadataCard
              data={data?.metadata}
              isPrivate={false}
              readonly={readonly}
              onChange={event => change(event, false)}
            />
            {(data?.privateMetadata || !hidePrivateMetadata) && (
              <MetadataCard
                data={data?.privateMetadata}
                isPrivate={true}
                readonly={readonly}
                onChange={event => change(event, true)}
              />
            )}
          </>
        )}
      </Box>
    );
  },
);

Metadata.displayName = "Metadata";
