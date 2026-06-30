import { AnnouncementImportanceEnum } from "@dashboard/graphql";

import { type AnnouncementViewModel } from "./types";

/** Severity order, most critical first. `UNSET` is treated as the lowest (informational). */
const SEVERITY_ORDER: AnnouncementImportanceEnum[] = [
  AnnouncementImportanceEnum.CRITICAL,
  AnnouncementImportanceEnum.HIGH,
  AnnouncementImportanceEnum.MODERATE,
  AnnouncementImportanceEnum.LOW,
  AnnouncementImportanceEnum.UNSET,
];

interface AnnouncementSeverityGroup {
  importance: AnnouncementImportanceEnum;
  announcements: AnnouncementViewModel[];
}

/**
 * Group announcements by severity, ordered most-critical first. Within a group,
 * announcements are ordered newest-first by `createdAt`. Empty groups are skipped.
 */
export const groupBySeverity = (
  announcements: AnnouncementViewModel[],
): AnnouncementSeverityGroup[] =>
  SEVERITY_ORDER.map(importance => ({
    importance,
    announcements: announcements
      .filter(announcement => announcement.importance === importance)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  })).filter(group => group.announcements.length > 0);
