import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { ProductVariantCreateDataQuery } from "@saleor/graphql";
import { toggle } from "@saleor/utils/lists";
import React, { useState } from "react";

interface CreateVariantChannelsDialogProps {
  channelListings: ProductVariantCreateDataQuery["product"]["channelListings"];
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedIds: string[]) => void;
}

export const CreateVariantChannelsDialog: React.FC<CreateVariantChannelsDialogProps> = ({
  channelListings,
  open,
  onClose,
  onConfirm,
}) => {
  const allChannelsIds = channelListings.map(c => c.channel.id);
  const allChannels = channelListings.map(c => c.channel);
  const [selected, setSelected] = useState(allChannelsIds);

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
