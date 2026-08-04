import {
  DetailSection,
  DetailSectionNav,
  type DetailSectionNavItem,
} from "@dashboard/components/DetailSectionNav/DetailSectionNav";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { type ChannelSectionId } from "./channelSectionIds";
import { messages } from "./messages";

export type ChannelSectionNavItem = DetailSectionNavItem & { id: ChannelSectionId };

interface ChannelSectionNavProps {
  items: ChannelSectionNavItem[];
  activeId?: ChannelSectionId;
  onSelect: (sectionId: ChannelSectionId) => void;
}

export const ChannelSectionNav = ({
  items,
  activeId,
  onSelect,
}: ChannelSectionNavProps): ReactNode => {
  const intl = useIntl();

  return (
    <DetailSectionNav
      items={items}
      activeId={activeId}
      onSelect={sectionId => onSelect(sectionId as ChannelSectionId)}
      ariaLabel={intl.formatMessage(messages.navAriaLabel)}
      data-test-id="channel-section-nav"
    />
  );
};

export const ChannelSection = ({
  id,
  children,
}: {
  id: ChannelSectionId;
  children: ReactNode;
}): ReactNode => <DetailSection id={id}>{children}</DetailSection>;
