import { useUser } from "@saleor/auth";
import { useBaseChannelsList } from "@saleor/channels/queries";
import { BaseChannels_channels } from "@saleor/channels/types/BaseChannels";
import { ChannelFragment } from "@saleor/fragments/types/ChannelFragment";
import useLocalStorage from "@saleor/hooks/useLocalStorage";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import { useSaleorConfig } from "@saleor/sdk";
import React from "react";

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

const AppChannelContext = React.createContext<AppChannelContextData>({
  availableChannels: [],
  channel: undefined,
  isPickerActive: false,
  refreshChannels: () => undefined,
  setChannel: () => undefined,
  setPickerActive: () => undefined
});

const isValidChannel = (
  channelId: string,
  channelList?: BaseChannels_channels[]
) => {
  if (!channelId) {
    return false;
  }

  return channelList?.some(getById(channelId));
};

export const AppChannelProvider: React.FC = ({ children }) => {
  const { setChannel } = useSaleorConfig();
  const { authenticated } = useUser();
  const [selectedChannel, setSelectedChannel] = useLocalStorage("channel", "");
  const { data: channelData, refetch } = useBaseChannelsList({
    skip: !authenticated
  });

  const [isPickerActive, setPickerActive] = React.useState(false);
  React.useEffect(() => {
    if (
      !isValidChannel(selectedChannel, channelData?.channels) &&
      channelData?.channels?.length > 0
    ) {
      setSelectedChannel(channelData.channels[0].id);
    }
  }, [channelData]);

  React.useEffect(() => {
    setChannel(selectedChannel);
  }, [selectedChannel]);

  const availableChannels = channelData?.channels || [];

  const channel =
    channelData && (availableChannels.find(getById(selectedChannel)) || null);

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
