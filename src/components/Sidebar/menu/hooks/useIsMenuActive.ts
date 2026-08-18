import { useLocation } from "react-router";

import { type SidebarMenuItem } from "../types";
import { isMenuActive } from "../utils";

export const useIsMenuActive = (menuItem: SidebarMenuItem): boolean => {
  const location = useLocation();

  // Navigation pins are distinguished by query string, so the search has to travel along.
  return isMenuActive(location.pathname + location.search, menuItem);
};
