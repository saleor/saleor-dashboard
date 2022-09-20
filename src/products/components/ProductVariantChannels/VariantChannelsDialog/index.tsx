import {
  ChannelPriceAndPreorderData,
  IChannelPriceAndPreorderArgs,
} from "@saleor/channels/utils";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { FormsetData } from "@saleor/hooks/useFormset";
import useModalDialogOpen from "@saleor/hooks/useModalDialogOpen";
import { toggle } from "@saleor/utils/lists";
import React, { useState } from "react";

import { ProductChannelListing } from "../types";

interface VariantChannelsDialogProps {
  channelListings: ProductChannelListing;
  selectedChannelListings?: FormsetData<
    ChannelPriceAndPreorderData,
    IChannelPriceAndPreorderArgs
  >;
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
  const preSelectedIds = selectedOrDefaults.map(c => c.id);
  const [selected, setSelected] = useState(preSelectedIds);

  const isSelected = currentItem => selected.includes(currentItem.id);

  const handleToggleAll = () => {
    setSelected(prev => (prev.length > 0 ? [] : allChannelsIds));
  };

  const handleConfirm = () => {
    onConfirm(selected);
    onClose();
  };

  const handleChange = ({ id }) => {
    setSelected(state => toggle(id, state, (aId, bId) => aId === bId));
  };

  useModalDialogOpen(open, {
    onOpen: () => {
      setSelected(preSelectedIds);
    },
  });

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
