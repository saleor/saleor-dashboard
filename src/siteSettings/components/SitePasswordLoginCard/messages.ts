import { defineMessages } from "react-intl";

export const messages = defineMessages({
  sectionTitle: {
    id: "kny5j9",
    defaultMessage: "Password Login",
    description: "section title",
  },
  sectionDescription: {
    id: "/2o5cH",
    defaultMessage:
      "Controls whether users can authenticate using password-based login. You can allow it for everyone, restrict it to customers only, or disable it entirely.",
    description: "section description",
  },
  cardHeader: {
    id: "qRMXUE",
    defaultMessage: "Password login mode",
    description: "card header",
  },
  enabled: {
    id: "k6kIUq",
    defaultMessage: "Enabled",
    description: "password login mode option",
  },
  enabledDescription: {
    id: "iidznP",
    defaultMessage: "All users can log in with a password",
    description: "password login mode option description",
  },
  customersOnly: {
    id: "3EFNZn",
    defaultMessage: "Customers only",
    description: "password login mode option",
  },
  customersOnlyDescription: {
    id: "3CMUKE",
    defaultMessage:
      "Only customer users can log in with a password. Staff users logging in with a password will be treated as customers.",
    description: "password login mode option description",
  },
  disabled: {
    id: "e8O72h",
    defaultMessage: "Disabled",
    description: "password login mode option",
  },
  disabledDescription: {
    id: "c5B5Cg",
    defaultMessage: "No user can log in with a password",
    description: "password login mode option description",
  },
});
