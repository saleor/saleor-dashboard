import { ChannelFragment } from "@dashboard/graphql";
import React from "react";

import { HomeSidebarContext } from "./homeSidebarContext";

interface HomeSidebarContextProviderProps {
  children: React.ReactNode;
  channel: ChannelFragment | undefined;
  setChannel: (channelId: string) => void;
  channels: ChannelFragment[];
  hasPermissionToManageOrders: boolean;
}

export const HomeSidebarContextProvider = ({
  children,
  channel,
  setChannel,
  channels,
  hasPermissionToManageOrders,
}: HomeSidebarContextProviderProps) => {
  const hasNoChannels = !channel && typeof channel !== "undefined";

  return (
    <HomeSidebarContext.Provider
      value={{
        selectedChannel: channel,
        setChannel,
        channels,
        hasNoChannels,
        hasPermissionToManageOrders,
      }}
    >
      {children}
    </HomeSidebarContext.Provider>
  );
};
