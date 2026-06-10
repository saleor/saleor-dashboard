import { useLocation } from "react-router";

import { type SidebarMenuItem } from "../types";
import { isMenuActive } from "../utils";

export const useIsMenuActive = (menuItem: SidebarMenuItem): boolean => {
  const location = useLocation();

  return isMenuActive(location.pathname, menuItem);
};
