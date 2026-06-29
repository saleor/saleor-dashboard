import { defineMessages } from "react-intl";

export const shippingMethodChannelsDialogMessages = defineMessages({
  title: {
    id: "8r8XBO",
    defaultMessage: "Choose channels for this shipping method",
    description: "shipping method channel picker dialog title without method name",
  },
  titleWithMethod: {
    id: "rjHiaH",
    defaultMessage: "Choose channels for {methodName}",
    description: "shipping method channel picker dialog title with method name",
  },
  description: {
    id: "DYn8fL",
    defaultMessage:
      "Select channels in the {zoneName} shipping zone where this method will be offered at checkout. You'll set prices for each channel next.",
    description: "shipping method channel picker dialog description",
  },
  descriptionWithMethod: {
    id: "AcKksu",
    defaultMessage:
      "Select channels in {zoneName} where {methodName} will be offered at checkout. You'll set prices for each channel next.",
    description: "shipping method channel picker dialog description with method name",
  },
});
