import { type AnnouncementFragment } from "@dashboard/graphql";

import { type AnnouncementViewModel } from "./types";

/**
 * Map a raw GraphQL `Announcement` into the UI-facing view model.
 *
 * Today this is a near-passthrough. It is the seam where per-`type` parsing of
 * the `extra` metadata bag will live once the metadata contract is defined —
 * producing derived view models that extend {@link AnnouncementViewModel}.
 */
export const mapAnnouncement = (announcement: AnnouncementFragment): AnnouncementViewModel => ({
  title: announcement.title,
  messageHtml: announcement.messageHtml,
  importance: announcement.importance,
  type: announcement.type,
  createdAt: announcement.createdAt,
  updatedAt: announcement.updatedAt,
});
