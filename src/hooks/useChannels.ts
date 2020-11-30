import { Channel } from "@saleor/channels/utils";
import useListActions from "@saleor/hooks/useListActions";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { useState } from "react";

function useChannels<T extends Channel>(channels: T[]) {
  const [isChannelsModalOpen, setChannelsModalOpen] = useState(false);

  const [currentChannels, setCurrentChannels] = useStateFromProps(channels);

  const {
    isSelected: isChannelSelected,
    listElements: channelListElements,
    set: setChannels,
    toggle: channelsToggle
  } = useListActions<T>(currentChannels, (a, b) => a.id === b.id);

  const handleChannelsModalClose = () => {
    setChannelsModalOpen(false);
    setChannels(currentChannels);
  };

  const handleChannelsModalOpen = () => setChannelsModalOpen(true);

  const handleChannelsConfirm = () => {
    const sortedChannelListElements = channelListElements.sort(
      (channel, nextChannel) => channel.name.localeCompare(nextChannel.name)
    );
    setCurrentChannels(sortedChannelListElements);
    setChannelsModalOpen(false);
  };

  const toggleAllChannels = (items: T[], selected: number) => {
    if (selected !== items.length) {
      setChannels(items);
    } else {
      setChannels([]);
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
