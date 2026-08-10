import {
  scrollToDetailSection,
  useDetailSectionScrollSpy,
} from "@dashboard/components/DetailSectionNav/useDetailSectionScrollSpy";

import { type ChannelSectionId } from "./channelSectionIds";

interface UseChannelSectionScrollSpyArgs {
  sectionIds: ChannelSectionId[];
  enabled?: boolean;
}

export const scrollToChannelSection = (sectionId: ChannelSectionId): void => {
  scrollToDetailSection(sectionId);
};

export const useChannelSectionScrollSpy = ({
  sectionIds,
  enabled = true,
}: UseChannelSectionScrollSpyArgs) => {
  const { activeId, selectSection } = useDetailSectionScrollSpy({ sectionIds, enabled });

  return {
    activeId: activeId as ChannelSectionId | undefined,
    selectSection: (sectionId: ChannelSectionId) => selectSection(sectionId),
  };
};
