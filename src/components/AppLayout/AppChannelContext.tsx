import { useAuth } from "@saleor/auth/AuthProvider";
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
export interface AppChannelContextData extends UseAppChannel {
  setPickerActive: (isActive: boolean) => void;
}

const AppChannelContext = React.createContext<AppChannelContextData>({
  availableChannels: [],
  channel: undefined,
  isPickerActive: false,
  refreshChannels: () => undefined,
  setChannel: () => undefined,
  setPickerActive: () => undefined
});

export const AppChannelProvider: React.FC = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [selectedChannel, setSelectedChannel] = useLocalStorage("channel", "");
  const { data: channelData, refetch } = useChannelsList({
    skip: !isAuthenticated
  });
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
    <AppChannelContext.Provider
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
    </AppChannelContext.Provider>
  );
};
AppChannelProvider.displayName = "AppChannelProvider";

function useAppChannel(enablePicker = true): UseAppChannel {
  const { setPickerActive, ...data } = React.useContext(AppChannelContext);
  React.useEffect(() => {
    if (enablePicker) {
      setPickerActive(true);
    }

    return () => setPickerActive(false);
  }, [enablePicker]);

  return data;
}

export default useAppChannel;
