import { IntlConfig } from "react-intl/src/types";
import { createIntl } from "react-intl";

export const testIntlConfig: IntlConfig = {
  defaultLocale: "en",
  locale: "en",
};

export const testIntlInstance = createIntl(testIntlConfig);
