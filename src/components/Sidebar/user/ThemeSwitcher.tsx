import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { DefaultTheme, Text } from "@saleor/macaw-ui-next";
import { Moon, Sun } from "lucide-react";
import { FormattedMessage } from "react-intl";

export const ThemeSwitcher = ({ theme }: { theme: DefaultTheme }): JSX.Element => {
  if (theme === "defaultLight") {
    return (
      <>
        <Moon size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
        <Text>
          <FormattedMessage id="5ObBlW" defaultMessage="Dark Mode" />
        </Text>
      </>
    );
  }

  return (
    <>
      <Sun size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
      <Text>
        <FormattedMessage id="hVPucN" defaultMessage="Light Mode" />
      </Text>
    </>
  );
};
