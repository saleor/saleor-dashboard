import { useMenuActiveOrderSection } from "@dashboard/orders/ActiveOrdersNavContext";
import { useLocation } from "react-router";

import { type SidebarMenuItem } from "../types";
import { isMenuActive } from "../utils";

export const useIsMenuActive = (menuItem: SidebarMenuItem): boolean => {
  const location = useLocation();
  const menuActiveOptions = useMenuActiveOrderSection();

  return isMenuActive(location.pathname, menuItem, menuActiveOptions);
};
