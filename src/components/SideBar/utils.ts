import { orderDraftListUrl, orderListUrl } from "@saleor/orders/urls";
import { matchPath } from "react-router";

import { IMenuItem } from "../AppLayout/menuStructure";

export function isMenuActive(location: string, menuItem: IMenuItem) {
  return location.split("?")[0] === orderDraftListUrl().split("?")[0] &&
    menuItem.url.split("?")[0] === orderListUrl().split("?")[0]
    ? false
    : !!matchPath(location.split("?")[0], {
        exact: menuItem.url.split("?")[0] === "/",
        path: menuItem.url.split("?")[0]
      });
}
