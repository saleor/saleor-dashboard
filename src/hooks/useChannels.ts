import { ChannelShippingData as Channel } from "@saleor/channels/utils";
import useListActions from "@saleor/hooks/useListActions";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { useState } from "react";

function useChannels(channels: Channel[]) {
  const [isChannelsModalOpen, setChannelsModalOpen] = useState(false);

  const [currentChannels, setCurrentChannels] = useStateFromProps(channels);

  const {
    isSelected: isChannelSelected,
    listElements: channelListElements,
    set: setChannels,
    toggle: channelsToggle
  } = useListActions<Channel>(currentChannels, (a, b) => a.id === b.id);

  const handleChannelsModalClose = () => {
    setChannelsModalOpen(false);
    setChannels(currentChannels);
  };

  const handleChannelsModalOpen = () => setChannelsModalOpen(true);

  const handleChannelsConfirm = () => {
    setCurrentChannels(channelListElements);
    setChannelsModalOpen(false);
  };

  const toggleAllChannels = (items: Channel[], selected: number) => {
    setChannels([]);
    if (selected !== items.length) {
      setChannels(items);
    }
  };

  return {
    channelListElements,
    channelsToggle,
    currentChannels,
    handleChannelsConfirm,
    handleChannelsModalClose,
    handleChannelsModalOpen,
    isChannelSelected,
    isChannelsModalOpen,
    setCurrentChannels,
    toggleAllChannels
  };
}

export default useChannels;
