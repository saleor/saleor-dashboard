import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { ChannelFragment } from "@saleor/graphql";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { DialogProps } from "@saleor/types";
import { arrayDiff } from "@saleor/utils/arrays";
import { toggle } from "@saleor/utils/lists";
import React from "react";
import { useIntl } from "react-intl";

import { ProductUpdateData } from "./types";

export type ProductChannelsListingDialogSubmit = (
  update: Record<"added" | "removed", string[]>,
) => void;

export interface ProductChannelsListingsDialogProps extends DialogProps {
  channels: ChannelFragment[];
  data: Pick<ProductUpdateData, "channels">;
  onConfirm: ProductChannelsListingDialogSubmit;
}

const ProductChannelsListingsDialog: React.FC<ProductChannelsListingsDialogProps> = ({
  channels,
  data,
  open,
  onClose,
  onConfirm,
}) => {
  const intl = useIntl();

  const [selected, setSelected] = useStateFromProps(
    data.channels.updateChannels.map(listing => listing.channelId),
  );

  const handleConfirm = () => {
    onConfirm(
      arrayDiff(
        data.channels.updateChannels.map(({ channelId }) => channelId),
        selected,
      ),
    );
    onClose();
  };

  const handleToggleAll = () =>
    selected.length !== channels.length
      ? setSelected(channels.map(({ id }) => id))
      : setSelected([]);

  return (
    <ChannelsAvailabilityDialog
      toggleAll={handleToggleAll}
      isSelected={({ id }) => selected.includes(id)}
      channels={channels}
      onChange={({ id }) =>
        setSelected(toggle(id, selected, (a, b) => a === b))
      }
      onClose={onClose}
      open={open}
      title={intl.formatMessage({
        id: "Eau5AV",
        defaultMessage: "Manage Products Channel Availability",
      })}
      confirmButtonState="default"
      selected={selected.length}
      onConfirm={handleConfirm}
    />
  );
};

ProductChannelsListingsDialog.displayName = "ProductChannelsListingsDialog";
export default ProductChannelsListingsDialog;
