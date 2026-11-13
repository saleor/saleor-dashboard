import { defineMessages } from "react-intl";

export const apiUnreachableMessages = defineMessages({
  title: {
    id: "iEb/sR",
    defaultMessage: "Can't reach Saleor",
    description: "heading when the dashboard can't reach the Saleor API at startup",
  },
  description: {
    id: "mqJjbj",
    defaultMessage: "Your session is kept, and the dashboard keeps trying to connect.",
    description: "explanation when the dashboard can't reach the Saleor API at startup",
  },
  apiAddress: {
    id: "l23D+b",
    defaultMessage: "Saleor API: {host}",
    description: "address of the Saleor API the dashboard is trying to reach",
  },
  tryAgain: {
    id: "UCvL1B",
    defaultMessage: "Try again",
    description: "button that retries reaching the Saleor API",
  },
  signIn: {
    id: "D2gFbm",
    defaultMessage: "Sign in with another account",
    description: "button that leaves the can't-reach-Saleor screen for the sign-in form",
  },
});
