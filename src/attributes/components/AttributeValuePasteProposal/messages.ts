import { defineMessages } from "react-intl";

export const attributeValuePasteMessages = defineMessages({
  hint: {
    id: "WYLzkv",
    defaultMessage:
      "Paste from a spreadsheet or a comma-separated list to add several values at once.",
    description: "hint that attribute value fields accept pasted lists",
  },
  pasteProposal: {
    id: "uTjSJn",
    defaultMessage: "Add {count, plural, one {# value} other {# values}} from this paste?",
    description: "prompt after pasting a list of attribute values",
  },
  pasteAdd: {
    id: "Luco3D",
    defaultMessage: "Add values",
    description: "confirm splitting pasted text into attribute values",
  },
  pasteKeep: {
    id: "z9qQzI",
    defaultMessage: "Keep as one",
    description: "keep pasted text as a single attribute value",
  },
});
