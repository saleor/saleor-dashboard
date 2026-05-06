import { defineMessages } from "react-intl";

export const modelTypeTabsMessages = defineMessages({
  allTab: {
    id: "Jnlk2Y",
    defaultMessage: "All",
    description: "Model Type tab showing all entries across types",
  },
  moreTab: {
    id: "Z+b2u3",
    defaultMessage: "More",
    description: "Overflow dropdown trigger holding additional Model Types",
  },
  emptyTypesCallout: {
    id: "TktK7L",
    defaultMessage: "No model types yet.",
    description: "Inline message in the type tabs row when no Model Types exist",
  },
  createFirstType: {
    id: "vDoAcW",
    defaultMessage: "Create your first model type",
    description: "Inline link in the type tabs row when no Model Types exist",
  },
  pinnedSection: {
    id: "5nUlWb",
    defaultMessage: "Pinned",
    description: "Section header in the Model Type More dropdown listing pinned types",
  },
  allTypesSection: {
    id: "ftio46",
    defaultMessage: "All types",
    description:
      "Section header in the Model Type More dropdown listing remaining (unpinned) types",
  },
  pinTypeAction: {
    id: "H0+SNu",
    defaultMessage: "Pin {name} to keep it visible at the start of the tab strip",
    description: "Accessible label for the pin button next to a Model Type in the More dropdown",
  },
  unpinTypeAction: {
    id: "IGOsZG",
    defaultMessage: "Unpin {name}",
    description: "Accessible label for the unpin button next to a pinned Model Type",
  },
});
