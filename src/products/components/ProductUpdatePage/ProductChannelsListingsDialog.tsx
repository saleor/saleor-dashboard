import ChannelsAvailabilityDialog from "@dashboard/components/ChannelsAvailabilityDialog";
import { areSelectedChannelIdsEqual } from "@dashboard/components/ChannelsAvailabilityDialog/utils";
import { type ChannelFragment } from "@dashboard/graphql";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { type DialogProps } from "@dashboard/types";
import { arrayDiff } from "@dashboard/utils/arrays";
import { toggle } from "@dashboard/utils/lists";
import { useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { type ProductUpdateData } from "./types";

export type ProductChannelsListingDialogSubmit = (
  update: Record<"added" | "removed", string[]>,
) => void;

interface ProductChannelsListingsDialogProps extends DialogProps {
  channels: ChannelFragment[];
  data: Pick<ProductUpdateData, "channels">;
  onConfirm: ProductChannelsListingDialogSubmit;
}

const getSelectedChannelIds = (data: Pick<ProductUpdateData, "channels">) =>
  data.channels.updateChannels?.map(({ channelId }) => channelId) ?? [];

const ProductChannelsListingsDialog = ({
  channels,
  data,
  open,
  onClose,
  onConfirm,
}: ProductChannelsListingsDialogProps) => {
  const intl = useIntl();
  const initialSelectedIds = getSelectedChannelIds(data);
  const [selected, setSelected] = useState(initialSelectedIds);
  const [baselineIds, setBaselineIds] = useState(initialSelectedIds);
  const hasSelectionChanged = useMemo(
    () => !areSelectedChannelIdsEqual(selected, baselineIds),
    [selected, baselineIds],
  );
  const handleClose = () => {
    setSelected(baselineIds);
    onClose();
  };
  const handleConfirm = () => {
    onConfirm(arrayDiff(baselineIds, selected));
    onClose();
  };
  const handleToggleAll = () =>
    selected.length !== channels.length
      ? setSelected(channels.map(({ id }) => id))
      : setSelected([]);

  useModalDialogOpen(open, {
    onOpen: () => {
      const nextSelectedIds = getSelectedChannelIds(data);

      setSelected(nextSelectedIds);
      setBaselineIds(nextSelectedIds);
    },
  });

  return (
    <ChannelsAvailabilityDialog
      toggleAll={handleToggleAll}
      isSelected={({ id }) => selected.includes(id)}
      channels={channels}
      onChange={({ id }) => setSelected(toggle(id, selected, (a, b) => a === b))}
      onClose={handleClose}
      open={open}
      title={intl.formatMessage({
        id: "Eau5AV",
        defaultMessage: "Manage Products Channel Availability",
      })}
      confirmButtonState="default"
      selected={selected?.length}
      hasSelectionChanged={hasSelectionChanged}
      onConfirm={handleConfirm}
    />
  );
};

ProductChannelsListingsDialog.displayName = "ProductChannelsListingsDialog";
export default ProductChannelsListingsDialog;
