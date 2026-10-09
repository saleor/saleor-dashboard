import ChannelsAvailabilityDialog from "@dashboard/components/ChannelsAvailabilityDialog/ChannelsAvailabilityDialog";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen/useModalDialogOpen";
import { toggle } from "@dashboard/utils/lists/lists";
import { type WarehouseChannelRef } from "@dashboard/warehouses/hooks/useWarehouseChannelMembership";
import { messages } from "@dashboard/warehouses/messages";
import { type ReactNode, useState } from "react";
import { useIntl } from "react-intl";

interface WarehouseChannelsAssignDialogProps {
  channels: WarehouseChannelRef[];
  open: boolean;
  confirming: boolean;
  onClose: () => void;
  onConfirm: (channelIds: string[]) => void;
}

export const WarehouseChannelsAssignDialog = ({
  channels,
  open,
  confirming,
  onClose,
  onConfirm,
}: WarehouseChannelsAssignDialogProps): ReactNode => {
  const intl = useIntl();
  const [selected, setSelected] = useState<string[]>([]);

  useModalDialogOpen(open, {
    onOpen: () => setSelected([]),
  });

  return (
    <ChannelsAvailabilityDialog
      channels={channels}
      open={open}
      title={intl.formatMessage(messages.channelsAddTitle)}
      confirmButtonState={confirming ? "loading" : "default"}
      disabled={confirming}
      selected={selected.length}
      hasSelectionChanged={selected.length > 0}
      isSelected={({ id }) => selected.includes(id)}
      onChange={({ id }) =>
        setSelected(current => toggle(id, current, (left, right) => left === right))
      }
      toggleAll={() =>
        setSelected(current =>
          current.length === channels.length ? [] : channels.map(channel => channel.id),
        )
      }
      onClose={onClose}
      onConfirm={() => onConfirm(selected)}
    />
  );
};
