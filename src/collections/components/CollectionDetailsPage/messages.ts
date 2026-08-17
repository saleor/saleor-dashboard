import { defineMessages } from "react-intl";

export const messages = defineMessages({
  openGraphiQL: {
    id: "iSnXTt",
    defaultMessage: "Open this collection in GraphiQL",
  },
  deleteCollection: {
    id: "uvVmpA",
    defaultMessage: "Delete collection",
    description: "collection detail cogs menu, opens the delete-confirmation dialog",
  },
  editCollectionMetadata: {
    id: "B0UcL7",
    defaultMessage: "Edit collection metadata",
    description: "collection detail page, top-bar metadata button tooltip",
  },
  seoHelper: {
    id: "Rj8LxK",
    defaultMessage:
      "Add search engine title and description to make this collection easier to find",
  },
  channelVisibleLabel: {
    id: "9vQR6c",
    defaultMessage: "Visible",
    description: "collection label",
  },
  channelHiddenLabel: {
    id: "V8FhTt",
    defaultMessage: "Hidden",
    description: "collection label",
  },
  saveCompositionGeneral: {
    id: "ijAoJZ",
    defaultMessage: "general",
    description: "Save composition segment for collection name, slug, description, SEO",
  },
  saveCompositionChannels: {
    id: "6i0KPD",
    defaultMessage: "channel availability",
    description: "Save composition segment for collection channel listings",
  },
});
