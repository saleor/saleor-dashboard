import { useChannelsList } from "@saleor/channels/queries";
import { ChannelDetailsFragment } from "@saleor/fragments/types/ChannelDetailsFragment";
import useLocalStorage from "@saleor/hooks/useLocalStorage";
import React from "react";

interface UseAppChannel {
  availableChannels: ChannelDetailsFragment[];
  channel: ChannelDetailsFragment;
  isPickerActive: boolean;
  refreshChannels: () => void;
  setChannel: (id: string) => void;
}
export interface ChannelContextData extends UseAppChannel {
  setPickerActive: (isActive: boolean) => void;
}

const ChannelContext = React.createContext<ChannelContextData>({
  availableChannels: [],
  channel: undefined,
  isPickerActive: false,
  refreshChannels: () => undefined,
  setChannel: () => undefined,
  setPickerActive: () => undefined
});

export const ChannelProvider: React.FC = ({ children }) => {
  const { data: channelData, refetch } = useChannelsList({});
  const [selectedChannel, setSelectedChannel] = useLocalStorage(
    "channel",
    undefined
  );
  const [isPickerActive, setPickerActive] = React.useState(false);
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
        isPickerActive,
        refreshChannels: refetch,
        setChannel: setSelectedChannel,
        setPickerActive
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
};

function useAppChannel(enablePicker = true): UseAppChannel {
  const { setPickerActive, ...data } = React.useContext(ChannelContext);
  React.useEffect(() => {
    if (enablePicker) {
      setPickerActive(true);
    }

    return () => setPickerActive(false);
  }, [enablePicker]);

  return data;
}

export default useAppChannel;
