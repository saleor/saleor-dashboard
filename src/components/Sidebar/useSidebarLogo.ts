import sideBarDefaultLogoDarkMode from "@assets/images/sidebar-deafult-logo-darkMode.png";
import sideBarDefaultLogo from "@assets/images/sidebar-default-logo.png";

import { useLegacyThemeHandler } from "./user/Controls";

export const useSidebarLogo = (): string => {
  const { theme } = useLegacyThemeHandler();

  return theme === "defaultLight" ? sideBarDefaultLogo : sideBarDefaultLogoDarkMode;
};
