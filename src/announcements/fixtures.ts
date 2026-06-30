import { AnnouncementImportanceEnum } from "@dashboard/graphql";

import { type AnnouncementViewModel } from "./types";

export const announcementFixtures: AnnouncementViewModel[] = [
  {
    title: "Scheduled maintenance",
    messageHtml: "<p>The API will be <strong>unavailable</strong> on Sunday.</p>",
    importance: AnnouncementImportanceEnum.CRITICAL,
    type: "CUSTOM",
    createdAt: "2026-06-20T10:00:00Z",
    updatedAt: "2026-06-20T10:00:00Z",
  },
  {
    title: "New feature available",
    messageHtml: "<p>Check out the new <a href='#'>refund reasons</a>.</p>",
    importance: AnnouncementImportanceEnum.MODERATE,
    type: "CUSTOM",
    createdAt: "2026-06-22T08:00:00Z",
    updatedAt: "2026-06-22T08:00:00Z",
  },
  {
    title: "Tip of the day",
    messageHtml: "<p>You can use keyboard shortcuts to navigate faster.</p>",
    importance: AnnouncementImportanceEnum.UNSET,
    type: "CUSTOM",
    createdAt: "2026-06-23T08:00:00Z",
    updatedAt: "2026-06-23T08:00:00Z",
  },
];

/**
 * Covers every severity with multiple announcements per group, to exercise the
 * group ordering (most-critical first) and newest-first ordering within a group.
 */
export const announcementGroupedFixtures: AnnouncementViewModel[] = [
  {
    title: "Database outage",
    messageHtml: "<p>Orders cannot be placed right now.</p>",
    importance: AnnouncementImportanceEnum.CRITICAL,
    type: "CUSTOM",
    createdAt: "2026-06-24T09:00:00Z",
    updatedAt: "2026-06-24T09:00:00Z",
  },
  {
    title: "Security patch applied",
    messageHtml: "<p>A critical security patch was applied last night.</p>",
    importance: AnnouncementImportanceEnum.CRITICAL,
    type: "CUSTOM",
    createdAt: "2026-06-25T06:00:00Z",
    updatedAt: "2026-06-25T06:00:00Z",
  },
  {
    title: "Elevated error rate",
    messageHtml: "<p>Some webhooks are delayed.</p>",
    importance: AnnouncementImportanceEnum.HIGH,
    type: "CUSTOM",
    createdAt: "2026-06-24T12:00:00Z",
    updatedAt: "2026-06-24T12:00:00Z",
  },
  {
    title: "Plan limit approaching",
    messageHtml: "<p>You are close to your monthly order limit.</p>",
    importance: AnnouncementImportanceEnum.MODERATE,
    type: "CUSTOM",
    createdAt: "2026-06-22T10:00:00Z",
    updatedAt: "2026-06-22T10:00:00Z",
  },
  {
    title: "Beta feature",
    messageHtml: "<p>Try the new bulk editor.</p>",
    importance: AnnouncementImportanceEnum.LOW,
    type: "CUSTOM",
    createdAt: "2026-06-21T10:00:00Z",
    updatedAt: "2026-06-21T10:00:00Z",
  },
  {
    title: "Did you know?",
    messageHtml: "<p>You can export reports as CSV.</p>",
    importance: AnnouncementImportanceEnum.UNSET,
    type: "CUSTOM",
    createdAt: "2026-06-20T10:00:00Z",
    updatedAt: "2026-06-20T10:00:00Z",
  },
];
