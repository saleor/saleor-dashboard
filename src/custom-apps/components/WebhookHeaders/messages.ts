import { defineMessages } from "react-intl";

export const messages = defineMessages({
  header: {
    id: "2BHjVL",
    defaultMessage: "Custom request headers",
    description: "header",
  },
  noHeaders: {
    id: "b1t9bM",
    defaultMessage:
      "No custom request headers created for this webhook. Use the button below to add new custom request header.",
    description: "empty headers text",
  },
  acceptedFormat: {
    id: "ZJPYFl",
    defaultMessage:
      "Headers with in following format are accepted: <code>authorization*</code>, <code>x-*</code>",
    description: "accepted header names",
  },
  headerName: {
    defaultMessage: "Name",
    id: "No4lyL",
    description: "header field name, header",
  },
  headerNameError: {
    id: "sGDsFP",
    defaultMessage: "Should match `x-*`, `authorization*`, or `brokerproperties`.",
    description: "header name input",
  },
  headerValue: {
    id: "/4bJkA",
    defaultMessage: "Value",
    description: "header field value, header",
  },
  actions: {
    id: "nEixpu",
    defaultMessage: "Actions",
    description: "table action",
  },
  add: {
    id: "uQNm59",
    defaultMessage: "Add custom request header",
    description: "add header,button",
  },
  headersCount: {
    id: "9Y5i/8",
    defaultMessage: "{number,plural,one{{number} header} other{{number} custom request headers}}",
    description: "number of webhook headers in model",
  },
});
