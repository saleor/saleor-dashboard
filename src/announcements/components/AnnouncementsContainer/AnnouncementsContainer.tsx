import { useAnnouncements } from "../../hooks/useAnnouncements";
import { AnnouncementsList } from "../AnnouncementsList/AnnouncementsList";

/**
 * Connects the announcements data source to the list UI. Mounted in the global
 * app shell so announcements are visible on every page.
 */
export const AnnouncementsContainer = () => {
  const { announcements } = useAnnouncements();

  return <AnnouncementsList announcements={announcements} />;
};
