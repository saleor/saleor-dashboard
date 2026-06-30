import { AnnouncementImportanceEnum } from "@dashboard/graphql";

import { groupBySeverity } from "./groupBySeverity";
import { type AnnouncementViewModel } from "./types";

const makeAnnouncement = (overrides: Partial<AnnouncementViewModel>): AnnouncementViewModel => ({
  title: "Title",
  messageHtml: "<p>Message</p>",
  importance: AnnouncementImportanceEnum.LOW,
  type: "CUSTOM",
  createdAt: "2026-06-20T10:00:00Z",
  updatedAt: "2026-06-20T10:00:00Z",
  ...overrides,
});

describe("groupBySeverity", () => {
  it("orders groups most-critical first and skips empty severities", () => {
    // Arrange
    const announcements: AnnouncementViewModel[] = [
      makeAnnouncement({ title: "low", importance: AnnouncementImportanceEnum.LOW }),
      makeAnnouncement({ title: "critical", importance: AnnouncementImportanceEnum.CRITICAL }),
      makeAnnouncement({ title: "unset", importance: AnnouncementImportanceEnum.UNSET }),
    ];

    // Act
    const groups = groupBySeverity(announcements);

    // Assert
    expect(groups.map(group => group.importance)).toEqual([
      AnnouncementImportanceEnum.CRITICAL,
      AnnouncementImportanceEnum.LOW,
      AnnouncementImportanceEnum.UNSET,
    ]);
  });

  it("orders announcements newest-first within a group", () => {
    // Arrange
    const announcements: AnnouncementViewModel[] = [
      makeAnnouncement({ title: "older", createdAt: "2026-06-20T10:00:00Z" }),
      makeAnnouncement({ title: "newer", createdAt: "2026-06-24T10:00:00Z" }),
    ];

    // Act
    const groups = groupBySeverity(announcements);

    // Assert
    expect(groups[0].announcements.map(a => a.title)).toEqual(["newer", "older"]);
  });

  it("returns an empty array when there are no announcements", () => {
    // Arrange / Act
    const groups = groupBySeverity([]);

    // Assert
    expect(groups).toEqual([]);
  });
});
