// @ts-strict-ignore
import { useUser } from "@dashboard/auth";
import { ChannelFragment, useBaseChannelsQuery } from "@dashboard/graphql";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { getById } from "@dashboard/misc";
import { useSaleorConfig } from "@saleor/sdk";
import { createContext, useState, useEffect, useContext } from "react";

interface UseAppChannel {
  availableChannels: ChannelFragment[];
  channel: ChannelFragment;
  isPickerActive: boolean;
  refreshChannels: () => void;
  setChannel: (id: string) => void;
}
export interface AppChannelContextData extends UseAppChannel {
  setPickerActive: (isActive: boolean) => void;
}

const AppChannelContext = createContext<AppChannelContextData>({
  availableChannels: [],
  channel: undefined,
  isPickerActive: false,
  refreshChannels: () => undefined,
  setChannel: () => undefined,
  setPickerActive: () => undefined,
});
const isValidChannel = (channelId: string, channelList?: ChannelFragment[]) => {
  if (!channelId) {
    return false;
  }

  return channelList?.some(getById(channelId));
};

export const AppChannelProvider = ({ children }) => {
  const { setChannel } = useSaleorConfig();
  const { authenticated, user } = useUser();
  const [selectedChannel, setSelectedChannel] = useLocalStorage("channel", "");
  const { data: channelData, refetch } = useBaseChannelsQuery({
    skip: !authenticated || !user,
  });
  const [isPickerActive, setPickerActive] = useState(false);

  useEffect(() => {
    const channels = user?.accessibleChannels ?? [];
    const isValid = isValidChannel(selectedChannel, channels);

    if (!isValid && channels?.length > 0) {
      setSelectedChannel(channels[0].id);
    }

    if (!isValid && selectedChannel !== "") {
      setSelectedChannel("");
    }
  }, [selectedChannel, setSelectedChannel, user]);
  useEffect(() => {
    setChannel(selectedChannel);
  }, [selectedChannel]);

  const availableChannels = channelData?.channels || [];
  const channel = channelData && (availableChannels.find(getById(selectedChannel)) || null);

  return (
    <AppChannelContext.Provider
      value={{
        availableChannels,
        channel,
        isPickerActive,
        refreshChannels: refetch,
        setChannel: setSelectedChannel,
        setPickerActive,
      }}
    >
      {children}
    </AppChannelContext.Provider>
  );
};

AppChannelProvider.displayName = "AppChannelProvider";

function useAppChannel(enablePicker = true): UseAppChannel {
  const { setPickerActive, ...data } = useContext(AppChannelContext);

  useEffect(() => {
    if (enablePicker) {
      setPickerActive(true);
    }

    return () => setPickerActive(false);
  }, [enablePicker]);

  return data;
}

export default useAppChannel;
