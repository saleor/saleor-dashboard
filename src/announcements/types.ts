import { type AnnouncementImportanceEnum } from "@dashboard/graphql";

/**
 * Normalized, UI-facing representation of a shop announcement.
 *
 * This is intentionally a thin mapping of the GraphQL `Announcement` type for now.
 * Later, per-`type` view models will extend this interface with data parsed from
 * the announcement's `extra` metadata bag
 * (e.g. `CustomAnnouncementViewModel extends AnnouncementViewModel`).
 */
export interface AnnouncementViewModel {
  title: string;
  /** Raw HTML message. Must be sanitized before rendering. */
  messageHtml: string;
  importance: AnnouncementImportanceEnum;
  /** Programmatic discriminator (e.g. "CUSTOM"). Drives per-type parsing of `extra`. */
  type: string;
  createdAt: string;
  updatedAt: string;
}
