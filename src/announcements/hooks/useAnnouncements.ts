import { isStagingSchema, useAnnouncementsQuery } from "@dashboard/graphql/staging";
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
 * Announcements only exist on the staging schema for now, so the query is
 * skipped entirely on the main schema (where the field does not exist). The
 * `skip` guard is removed once the API is backported and the query migrates to
 * the main schema.
 *
 * Announcements are non-essential, so errors fail silently to an empty list
 * rather than surfacing to the user.
 */
export const useAnnouncements = (): UseAnnouncementsResult => {
  const { data, loading } = useAnnouncementsQuery({
    fetchPolicy: "cache-and-network",
    skip: !isStagingSchema(),
  });

  const announcements = useMemo(
    () => (data?.shop.announcements ?? []).map(mapAnnouncement),
    [data],
  );

  return { announcements, loading };
};
