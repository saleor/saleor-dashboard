import { defineMessages } from "react-intl";

export const shippingMethodChannelsDialogMessages = defineMessages({
  title: {
    id: "/p+Kha",
    defaultMessage: "Set up pricing for additional channels",
    description: "shipping method channel picker dialog title without method name",
  },
  titleWithMethod: {
    id: "cI+YgH",
    defaultMessage: "Set up pricing for {methodName} for additional channels",
    description: "shipping method channel picker dialog title with method name",
  },
  description: {
    id: "2P5kC7",
    defaultMessage:
      "Select channels in the {zoneName} shipping zone where this method will be offered at checkout.",
    description: "shipping method channel picker dialog description",
  },
  descriptionWithMethod: {
    id: "9/LW/H",
    defaultMessage: "Select channels in {zoneName} where {methodName} will be offered at checkout.",
    description: "shipping method channel picker dialog description with method name",
  },
});
