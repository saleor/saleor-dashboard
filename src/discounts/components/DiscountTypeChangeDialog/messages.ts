import { defineMessages } from "react-intl";

export const discountTypeChangeDialogMessages = defineMessages({
  title: {
    id: "dhCfVo",
    defaultMessage: "Change discount type?",
    description: "dialog title, shown when changing a new promotion's type would remove its rules",
  },
  body: {
    id: "BU7Q6s",
    defaultMessage:
      "{count, plural, one {The rule you added only works} other {The # rules you added only work}} for {type} promotions. Changing the type removes {count, plural, one {it} other {them}}.",
    description: "dialog text; type is the current promotion type, Catalog or Order",
  },
  confirm: {
    id: "+cHoug",
    defaultMessage: "Change type",
    description: "button that changes a new promotion's type and removes its rules",
  },
});
