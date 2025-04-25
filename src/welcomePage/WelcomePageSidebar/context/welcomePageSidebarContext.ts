import { ChannelFragment } from "@dashboard/graphql";
import { createContext, useContext } from "react";

export interface WelcomePageSidebarContext {
  selectedChannel: ChannelFragment | undefined;
  setChannel: (channelId: string) => void;
  channels: ChannelFragment[];
  hasNoChannels: boolean;
  hasPermissionToManageOrders: boolean;
}

export const WelcomePageSidebarContext = createContext<WelcomePageSidebarContext | null>(null);

export const useWelcomePageSidebarContext = () => {
  const context = useContext(WelcomePageSidebarContext);

  if (!context) {
    throw new Error(
      "WelcomePageSidebarContext is null. Make sure your component is wrapped in a <WelcomePageSidebarContext.Provider>",
    );
  }

  return context;
};
