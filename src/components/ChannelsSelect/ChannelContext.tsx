import { useChannelsList } from "@saleor/channels/queries";
import { ChannelDetailsFragment } from "@saleor/fragments/types/ChannelDetailsFragment";
import useLocalStorage from "@saleor/hooks/useLocalStorage";
import React from "react";

export interface ChannelContextData {
  availableChannels: ChannelDetailsFragment[];
  channel: ChannelDetailsFragment;
  refreshChannels: () => void;
  setChannel: (id: string) => void;
}

const ChannelContext = React.createContext<ChannelContextData>({
  availableChannels: [],
  channel: undefined,
  refreshChannels: () => undefined,
  setChannel: () => undefined
});

export const ChannelProvider: React.FC = ({ children }) => {
  const { data: channelData, refetch } = useChannelsList({});
  const [selectedChannel, setSelectedChannel] = useLocalStorage(
    "channel",
    undefined
  );
  React.useEffect(() => {
    if (!selectedChannel) {
      setSelectedChannel(channelData?.channels[0].id);
    }
  }, [channelData]);

  const availableChannels = channelData?.channels || [];
  const channel = availableChannels.find(
    channel => channel.id === selectedChannel
  );

  return (
    <ChannelContext.Provider
      value={{
        availableChannels,
        channel,
        refreshChannels: refetch,
        setChannel: setSelectedChannel
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
};

const useAppChannel = () => React.useContext(ChannelContext);

export default useAppChannel;
