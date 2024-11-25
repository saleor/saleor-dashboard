import { ChannelFragment } from "@dashboard/graphql";
import { createContext, useContext } from "react";

export interface HomeSidebarContext {
  selectedChannel: ChannelFragment | undefined;
  setChannel: (channelId: string) => void;
  channels: ChannelFragment[];
  hasNoChannels: boolean;
  hasPermissionToManageOrders: boolean;
}

export const HomeSidebarContext = createContext<HomeSidebarContext | null>(null);

export const useHomeSidebarContext = () => {
  const context = useContext(HomeSidebarContext);

  if (!context) {
    throw new Error(
      "HomeSidebarContext is null. Make sure your component is wrapped in a <HomeSidebarContext.Provider>",
    );
  }

  return context;
};
