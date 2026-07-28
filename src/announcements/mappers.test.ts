import { type AnnouncementFragment, AnnouncementImportanceEnum } from "@dashboard/graphql";

import { mapAnnouncement } from "./mappers";

describe("mapAnnouncement", () => {
  it("maps the base announcement fields", () => {
    // Arrange
    const raw: AnnouncementFragment = {
      __typename: "Announcement",
      title: "Maintenance",
      messageHtml: "<p>Down on Sunday</p>",
      importance: AnnouncementImportanceEnum.CRITICAL,
      type: "CUSTOM",
      createdAt: "2026-06-20T10:00:00Z",
      updatedAt: "2026-06-21T10:00:00Z",
      extra: { ignored: "value" },
    };

    // Act
    const result = mapAnnouncement(raw);

    // Assert
    expect(result).toEqual({
      title: "Maintenance",
      messageHtml: "<p>Down on Sunday</p>",
      importance: AnnouncementImportanceEnum.CRITICAL,
      type: "CUSTOM",
      createdAt: "2026-06-20T10:00:00Z",
      updatedAt: "2026-06-21T10:00:00Z",
    });
  });

  it("does not expose extra on the base view model", () => {
    // Arrange
    const raw: AnnouncementFragment = {
      __typename: "Announcement",
      title: "Tip",
      messageHtml: "<p>Tip</p>",
      importance: AnnouncementImportanceEnum.UNSET,
      type: "CUSTOM",
      createdAt: "2026-06-23T08:00:00Z",
      updatedAt: "2026-06-23T08:00:00Z",
      extra: { foo: "bar" },
    };

    // Act
    const result = mapAnnouncement(raw);

    // Assert
    expect(result).not.toHaveProperty("extra");
  });
});
