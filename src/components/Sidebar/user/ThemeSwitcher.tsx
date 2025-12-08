import { DefaultTheme, Text } from "@saleor/macaw-ui-next";
import { Moon, Sun } from "lucide-react";
import { FormattedMessage } from "react-intl";

export const ThemeSwitcher = ({ theme }: { theme: DefaultTheme }) => {
  if (theme === "defaultLight") {
    return (
      <>
        <Moon color="default2" />
        <Text>
          <FormattedMessage id="5ObBlW" defaultMessage="Dark Mode" />
        </Text>
      </>
    );
  }

  return (
    <>
      <Sun color="default2" />
      <Text>
        <FormattedMessage id="hVPucN" defaultMessage="Light Mode" />
      </Text>
    </>
  );
};
