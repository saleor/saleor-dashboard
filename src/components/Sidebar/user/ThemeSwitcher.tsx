import { DarkModeIcon, DefaultTheme, LightModeIcon, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

export const ThemeSwitcher = ({ theme }: { theme: DefaultTheme }) => {
  if (theme === "defaultLight") {
    return (
      <>
        <DarkModeIcon color="default2" />
        <Text>
          <FormattedMessage id="5ObBlW" defaultMessage="Dark Mode" />
        </Text>
      </>
    );
  }
  return (
    <>
      <LightModeIcon color="default2" />
      <Text>
        <FormattedMessage id="hVPucN" defaultMessage="Light Mode" />
      </Text>
    </>
  );
};
