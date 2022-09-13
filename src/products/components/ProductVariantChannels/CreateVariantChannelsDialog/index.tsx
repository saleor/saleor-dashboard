import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { ProductVariantCreateDataQuery } from "@saleor/graphql";
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

  return (
    <ChannelsAvailabilityDialog
      isSelected={isSelected}
      channels={allChannels}
      onChange={eventItem => {
        setSelected(state => {
          const currentLength = state.length;
          const filtered = state.filter(itemId => itemId !== eventItem.id);

          if (filtered.length === currentLength) {
            return state.concat(eventItem.id);
          }

          return filtered;
        });
      }}
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
