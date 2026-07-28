import { type BoxProps } from "@saleor/macaw-ui-next";

import { useAnnouncements } from "../../hooks/useAnnouncements";
import { AnnouncementsList } from "../AnnouncementsList/AnnouncementsList";

/**
 * Connects the announcements data source to the list UI. Mounted in the global
 * app shell so announcements are visible on every page. Forwards layout props
 * (e.g. margin) to the list root.
 */
export const AnnouncementsContainer = (boxProps: BoxProps) => {
  const { announcements } = useAnnouncements();

  return <AnnouncementsList announcements={announcements} {...boxProps} />;
};
