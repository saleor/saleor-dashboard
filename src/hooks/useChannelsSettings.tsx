import { useChannelsList } from "@saleor/channels/queries";
import useLocalStorage from "@saleor/hooks/useLocalStorage";
import { useEffect } from "react";

interface Actions {
  openModal: (value: string) => void;
  closeModal: () => void;
}

function useChannelsSettings(key: string, { openModal, closeModal }: Actions) {
  const { data: channelsData } = useChannelsList({});
  const channelChoices = channelsData?.channels?.map(channel => ({
    label: channel.name,
    value: channel.id
  }));

  const [selectedChannel, setSelectedChannel] = useLocalStorage(key, "");

  const handleChannelSelectConfirm = (channel: string) => {
    setSelectedChannel(channel);
    closeModal();
  };

  useEffect(() => {
    if (!selectedChannel) {
      openModal("settings");
    }
  }, [selectedChannel]);

  return {
    channelChoices,
    handleChannelSelectConfirm,
    selectedChannel,
    selectedChannelSlug:
      channelsData?.channels?.find(channel => channel.id === selectedChannel)
        ?.slug || ""
  };
}

export default useChannelsSettings;
