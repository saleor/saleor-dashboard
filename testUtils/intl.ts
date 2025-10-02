import { IntlConfig, IntlShape } from "react-intl/src/types";

export const config: IntlConfig = {
  defaultLocale: "en",
  locale: "en",
};

// todo remove
export const intlMock = {
  formatMessage: ({ defaultMessage }) => defaultMessage,
} as IntlShape;
