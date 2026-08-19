import { createContext, type ReactNode, useContext } from "react";

import { type ChannelSectionId } from "./channelSectionIds";

interface ChannelSectionScrollContextValue {
  selectSection: (sectionId: ChannelSectionId) => void;
}

const ChannelSectionScrollContext = createContext<ChannelSectionScrollContextValue | null>(null);

interface ChannelSectionScrollProviderProps {
  selectSection: (sectionId: ChannelSectionId) => void;
  children: ReactNode;
}

export const ChannelSectionScrollProvider = ({
  selectSection,
  children,
}: ChannelSectionScrollProviderProps) => (
  <ChannelSectionScrollContext.Provider value={{ selectSection }}>
    {children}
  </ChannelSectionScrollContext.Provider>
);

export const useChannelSectionScroll = (): ChannelSectionScrollContextValue | null =>
  useContext(ChannelSectionScrollContext);
