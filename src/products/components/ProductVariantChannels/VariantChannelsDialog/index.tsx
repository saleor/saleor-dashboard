import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { toggle } from "@saleor/utils/lists";
import React, { useState } from "react";

import { ChannelListings, ProductChannelListing } from "../types";

interface VariantChannelsDialogProps {
  channelListings: ProductChannelListing;
  selectedChannelListings?: ChannelListings;
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedIds: string[]) => void;
}

export const VariantChannelsDialog: React.FC<VariantChannelsDialogProps> = ({
  channelListings,
  selectedChannelListings,
  open,
  onClose,
  onConfirm,
}) => {
  const selectedOrDefaults = selectedChannelListings ?? channelListings;
  const allChannelsIds = channelListings.map(c => c.channel.id);
  const allChannels = channelListings.map(c => c.channel);
  const preSelectedIds = selectedOrDefaults.map(c => c.channel.id);

  const [selected, setSelected] = useState(preSelectedIds);

  const isSelected = currentItem => selected.includes(currentItem.id);

  const handleToggleAll = () => {
    setSelected(allChannelsIds);
  };

  const handleConfirm = () => {
    onConfirm(selected);
    onClose();
  };

  const handleChange = ({ id }) => {
    setSelected(state => toggle(id, state, (aId, bId) => aId === bId));
  };

  return (
    <ChannelsAvailabilityDialog
      isSelected={isSelected}
      channels={allChannels}
      onChange={handleChange}
      onClose={onClose}
      open={open}
      title="Manage Products Channel Availability"
      confirmButtonState="default"
      selected={selected.length}
      onConfirm={handleConfirm}
      toggleAll={handleToggleAll}
    />
  );
};
