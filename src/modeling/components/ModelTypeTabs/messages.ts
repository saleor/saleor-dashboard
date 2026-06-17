import { defineMessages } from "react-intl";

export const modelTypeTabsMessages = defineMessages({
  allTab: {
    id: "/zb21Y",
    defaultMessage: "All",
    description: "tab name for all models",
  },
  moreTab: {
    id: "uq2aqJ",
    defaultMessage: "More",
    description: "overflow tab label",
  },
  pinTab: {
    id: "/js4TV",
    defaultMessage: "Pin tab",
    description: "aria label for pinning a tab",
  },
  unpinTab: {
    id: "jg1Kcw",
    defaultMessage: "Unpin tab",
    description: "aria label for unpinning a tab",
  },
  settingsTitle: {
    id: "NEmY1y",
    defaultMessage: "Tab grouping",
    description: "title for model type tab settings",
  },
  separatorLabel: {
    id: "oyXhGL",
    defaultMessage: "Split on",
    description: "label for model type tab grouping separator input",
  },
  separatorHint: {
    id: "xUUaUR",
    defaultMessage: "Split at the first match. Separate multiple with commas.",
    description: "hint for model type tab grouping separator input",
  },
  separatorPlaceholder: {
    id: "tELvPJ",
    defaultMessage: "Comma-separated list of separators",
    description: "placeholder for model type tab grouping separator input",
  },
  groupingEnabledLabel: {
    id: "wu/9MB",
    defaultMessage: "Group similar model types",
    description: "label for enabling grouped model type tabs",
  },
  groupAllLabel: {
    id: "wdqbOW",
    defaultMessage: "{prefix} <all>All</all>",
    description: "label for selecting all subtypes in a grouped model type tab",
  },
  groupMenuLabel: {
    id: "C2VZAl",
    defaultMessage: "Choose {prefix} subtype",
    description: "aria label for grouped model type tab menu",
  },
  groupingHelpAriaLabel: {
    id: "Vsax0N",
    defaultMessage: "How tab grouping works",
    description: "aria label for model type tab grouping help",
  },
  groupingHelpIntro: {
    id: "TZZ8Z7",
    defaultMessage:
      "Each model type name is split at the first matching separator. The part before becomes the tab name; the part after appears in the tab menu.",
    description: "intro for model type tab grouping help tooltip",
  },
  groupingHelpExamplesHeading: {
    id: "EE8PaG",
    defaultMessage: "Examples",
    description: "section heading for examples in model type tab grouping help tooltip",
  },
  groupingHelpExampleStorefront: {
    id: "gbo0sd",
    defaultMessage:
      'With separator "—", types named <em>Storefront — Cart</em> and <em>Storefront — Checkout</em> appear under one <strong>Storefront</strong> tab.',
    description: "storefront example in model type tab grouping help tooltip",
  },
  groupingHelpExampleHelp: {
    id: "UhqCK5",
    defaultMessage:
      '<em>Help section for Docs</em> with separator "section for" appears under a <strong>Help</strong> tab.',
    description: "help section example in model type tab grouping help tooltip",
  },
  groupingHelpNotesHeading: {
    id: "mSxdrx",
    defaultMessage: "Notes",
    description: "section heading for notes in model type tab grouping help tooltip",
  },
  groupingHelpNoteSeparators: {
    id: "SdnSCt",
    defaultMessage: "Enter multiple separators as a comma-separated list.",
    description: "note about separators input in model type tab grouping help",
  },
  groupingHelpNoteCase: {
    id: "oK7729",
    defaultMessage: "Letter case is ignored when matching prefixes.",
    description: "note about case insensitivity in model type tab grouping help",
  },
  groupingHelpNoteStandalone: {
    id: "F2Ng8N",
    defaultMessage: "Types without a separator stay as separate tabs.",
    description: "note about standalone tabs in model type tab grouping help",
  },
  groupingHelpScope: {
    id: "AJF7N5",
    defaultMessage:
      "Browser-only display — does not rename, merge, or change your model types or data.",
    description: "scope note for model type tab grouping help tooltip",
  },
});
