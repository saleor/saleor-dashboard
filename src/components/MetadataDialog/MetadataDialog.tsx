import { MetadataInput } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import { removeAtIndex, updateAtIndex } from "@dashboard/utils/lists";
import { Box, Button } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { MetadataCard } from "../Metadata/MetadataCard";
import { EventDataAction, EventDataField } from "../Metadata/types";
import { getDataKey, parseEventData } from "../Metadata/utils";
import { DashboardModal } from "../Modal";

export interface MetadataDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  data: {
    metadata: MetadataInput[];
    privateMetadata: MetadataInput[];
  };
  onChange: (event: ChangeEvent) => void;
}

export const MetadataDialog = ({ open, onClose, onSave, data, onChange }: MetadataDialogProps) => {
  const intl = useIntl();

  const change = (event: ChangeEvent, isPrivate: boolean) => {
    const { action, field, fieldIndex, value } = parseEventData(event);
    const key = getDataKey(isPrivate);
    const dataToUpdate = data[key] ?? [];

    onChange({
      target: {
        name: key,
        value:
          action === EventDataAction.update
            ? updateAtIndex(
                {
                  ...dataToUpdate[fieldIndex as number],
                  key:
                    field === EventDataField.name ? value : dataToUpdate[fieldIndex as number].key,
                  value:
                    field === EventDataField.value
                      ? value
                      : dataToUpdate[fieldIndex as number].value,
                },
                dataToUpdate,
                fieldIndex as number,
              )
            : action === EventDataAction.add
              ? [
                  ...dataToUpdate,
                  {
                    key: "",
                    value: "",
                  },
                ]
              : removeAtIndex(dataToUpdate, fieldIndex as number),
      },
    });
  };

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="md">
        <DashboardModal.Header>{intl.formatMessage(commonMessages.metadata)}</DashboardModal.Header>
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          overflowY="auto"
          style={{
            maxHeight: "calc(100vh - 320px)",
          }}
        >
          <MetadataCard
            data={data?.metadata ?? []}
            isPrivate={false}
            onChange={event => change(event, false)}
          />
          <MetadataCard
            data={data?.privateMetadata ?? []}
            isPrivate={true}
            onChange={event => change(event, true)}
          />
        </Box>
      </DashboardModal.Content>
      <DashboardModal.Actions>
        <Button variant="secondary" onClick={onClose}>
          {intl.formatMessage(buttonMessages.close)}
        </Button>
        <Button onClick={onSave}>{intl.formatMessage(buttonMessages.save)}</Button>
      </DashboardModal.Actions>
    </DashboardModal>
  );
};
