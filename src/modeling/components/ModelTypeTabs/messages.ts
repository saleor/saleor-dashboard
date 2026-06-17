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
    id: "SjMQrX",
    defaultMessage: "Group separator",
    description: "label for model type tab grouping separator input",
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
    id: "DtSn3X",
    defaultMessage:
      "Model type names are split at the separator you enter. The part before it becomes the tab name; the part after appears in the tab menu.",
    description: "intro for model type tab grouping help tooltip",
  },
  groupingHelpExample: {
    id: "pNKz+B",
    defaultMessage:
      'Example: with separator " - ", types named "Storefront - Cart" and "Storefront - Checkout" appear under one Storefront tab.',
    description: "example for model type tab grouping help tooltip",
  },
  groupingHelpCase: {
    id: "E2QWJR",
    defaultMessage:
      'Letter case is ignored, so "a page" and "A page" are grouped together. Types without the separator stay as separate tabs.',
    description: "case sensitivity note for model type tab grouping help tooltip",
  },
  groupingHelpScope: {
    id: "V/HG7k",
    defaultMessage:
      "This is only a display convenience saved in your browser. It does not rename, merge, or change your model types, models, or any other store data.",
    description: "scope note for model type tab grouping help tooltip",
  },
});
