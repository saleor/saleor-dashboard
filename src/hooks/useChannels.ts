import { ChannelsAction } from "@saleor/channels/urls";
import { Channel } from "@saleor/channels/utils";
import useListActions from "@saleor/hooks/useListActions";
import useStateFromProps from "@saleor/hooks/useStateFromProps";

interface Modal {
  openModal: (action: ChannelsAction) => void;
  closeModal: () => void;
}

function useChannels<T extends Channel, A>(
  channels: T[],
  action: A | ChannelsAction,
  { closeModal, openModal }: Modal
) {
  const [currentChannels, setCurrentChannels] = useStateFromProps(channels);

  const {
    isSelected: isChannelSelected,
    listElements: channelListElements,
    set: setChannels,
    toggle: channelsToggle
  } = useListActions<T>(currentChannels, (a, b) => a.id === b.id);

  const handleChannelsModalClose = () => {
    closeModal();
    setChannels(currentChannels);
  };

  const handleChannelsModalOpen = () => openModal("open-channels-picker");

  const handleChannelsConfirm = () => {
    const sortedChannelListElements = channelListElements.sort(
      (channel, nextChannel) => channel.name.localeCompare(nextChannel.name)
    );
    setCurrentChannels(sortedChannelListElements);
    closeModal();
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
    isChannelsModalOpen: action === "open-channels-picker",
    setCurrentChannels,
    toggleAllChannels
  };
}

export default useChannels;
