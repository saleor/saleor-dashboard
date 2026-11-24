import { sectionNames } from "@dashboard/intl";
import { snapshotsAndDataMessages } from "@dashboard/snapshotsAndData/messages";
import { snapshotsAndDataPath } from "@dashboard/snapshotsAndData/urls";
import { defineMessages } from "react-intl";

import { settingsHref } from "./hashes";
import { type SettingsCatalogEntry } from "./types";

const messages = defineMessages({
  keywords: {
    id: "WpgVrV",
    defaultMessage:
      "snapshot backup restore sample data populate clear orders clear database reset wipe",
    description: "settings search alias",
  },
});

export const snapshotsAndDataCatalogEntries: SettingsCatalogEntry[] = [
  {
    id: "snapshotsAndData.hub",
    kind: "hub",
    title: sectionNames.snapshotsAndData,
    description: snapshotsAndDataMessages.description,
    breadcrumbs: [sectionNames.snapshotsAndData],
    href: settingsHref(snapshotsAndDataPath),
    cloudOnly: true,
    keywords: [messages.keywords],
  },
];
