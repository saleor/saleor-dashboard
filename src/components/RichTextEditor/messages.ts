import { defineMessages } from "react-intl";

export const richTextEditorMessages = defineMessages({
  embedTitle: {
    id: "28sK1U",
    defaultMessage: "Embed",
    description: "rich text editor toolbox item that embeds a video or a post",
  },
  addEmbedByLink: {
    id: "nGWrzz",
    defaultMessage: "Add embed by link",
    description: "rich text editor button in an empty embed block",
  },
  embedLinkPrompt: {
    id: "sMubuZ",
    defaultMessage: "Paste a link to a YouTube or Vimeo video, a post, or another embeddable page",
    description: "rich text editor prompt asking for a link to embed",
  },
  embedLinkUnsupported: {
    id: "KqZYkD",
    defaultMessage: "This link can't be embedded",
    description: "rich text editor error when no embed service matches the link",
  },
  openLinkInNewTab: {
    id: "vilKnI",
    defaultMessage: "Open in new tab",
    description:
      "rich text editor inline toolbar button that makes the selected link open in a new tab",
  },
  addImageByLink: {
    id: "qCHM6u",
    defaultMessage: "Add image by link",
    description: "rich text editor button in an empty image block",
  },
  imageLinkPrompt: {
    id: "iz1ug3",
    defaultMessage: "Paste a link to an image",
    description: "rich text editor prompt asking for an image link",
  },
});
