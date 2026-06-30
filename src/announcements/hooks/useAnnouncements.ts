import { useAnnouncementsQuery } from "@dashboard/graphql";
import { useMemo } from "react";

import { mapAnnouncement } from "../mappers";
import { type AnnouncementViewModel } from "../types";

interface UseAnnouncementsResult {
  announcements: AnnouncementViewModel[];
  loading: boolean;
}

/**
 * Fetches shop announcements and maps them into UI-facing view models.
 *
 * Announcements are non-essential, so errors fail silently to an empty list
 * rather than surfacing to the user.
 */
export const useAnnouncements = (): UseAnnouncementsResult => {
  const { data, loading } = useAnnouncementsQuery({
    fetchPolicy: "cache-and-network",
  });

  const announcements = useMemo(
    () => (data?.shop.announcements ?? []).map(mapAnnouncement),
    [data],
  );

  return { announcements, loading };
};
