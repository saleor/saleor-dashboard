import { DefaultTheme, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";
import { Moon, Sun } from "lucide-react";

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
