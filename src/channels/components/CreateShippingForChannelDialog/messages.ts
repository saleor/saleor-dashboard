import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    id: "ijRTbx",
    defaultMessage: "Create shipping zone",
    description: "create shipping for channel dialog title",
  },
  description: {
    id: "rrU/T2",
    defaultMessage:
      "Creates a zone for {country} on this channel{warehouseSuffix}, with one flat-rate method.",
    description: "create shipping for channel dialog description",
  },
  warehouseSuffix: {
    id: "yYLFG8",
    defaultMessage: ", using warehouse {warehouse}",
    description: "warehouse mention in shipping setup dialog",
  },
  zoneName: {
    id: "iQkrjy",
    defaultMessage: "Shipping zone name",
  },
  rateName: {
    id: "IqFUJl",
    defaultMessage: "Rate name",
  },
  price: {
    id: "UbJf55",
    defaultMessage: "Flat rate ({currency})",
  },
  domestic: {
    id: "nKGplR",
    defaultMessage: "Domestic",
    description: "default shipping zone name",
  },
  standardShipping: {
    id: "SJSWi7",
    defaultMessage: "Standard shipping",
    description: "default flat rate name",
  },
  submit: {
    id: "3Yn1Qe",
    defaultMessage: "Create shipping",
    description: "create shipping for channel",
  },
});
