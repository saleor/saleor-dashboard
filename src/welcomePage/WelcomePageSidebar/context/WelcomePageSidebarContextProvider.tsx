import { ChannelFragment } from "@dashboard/graphql";
import React from "react";

import { WelcomePageSidebarContext } from "./welcomePageSidebarContext";

export interface WelcomePageSidebarContextProviderProps {
  children: React.ReactNode;
  channel: ChannelFragment | undefined;
  setChannel: (channelId: string) => void;
  channels: ChannelFragment[];
  hasPermissionToManageOrders: boolean;
}

export const WelcomePageSidebarContextProvider = ({
  children,
  channel,
  setChannel,
  channels,
  hasPermissionToManageOrders,
}: WelcomePageSidebarContextProviderProps) => {
  const hasNoChannels = !channel && typeof channel !== "undefined";

  return (
    <WelcomePageSidebarContext.Provider
      value={{
        selectedChannel: channel,
        setChannel,
        channels,
        hasNoChannels,
        hasPermissionToManageOrders,
      }}
    >
      {children}
    </WelcomePageSidebarContext.Provider>
  );
};
