import {
  DarkModeIcon,
  DefaultTheme,
  LightModeIcon,
  Text,
} from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage } from "react-intl";

export const ThemeSwitcher = ({ theme }: { theme: DefaultTheme }) => {
  if (theme === "defaultLight") {
    return (
      <>
        <DarkModeIcon color="iconNeutralSubdued" />
        <Text>
          <FormattedMessage id="GgkZ5I" defaultMessage="Enable Dark Mode" />
        </Text>
      </>
    );
  }
  return (
    <>
      <LightModeIcon color="iconNeutralSubdued" />
      <Text>
        <FormattedMessage id="4EkOwL" defaultMessage="Enable Light Mode" />
      </Text>
    </>
  );
};
