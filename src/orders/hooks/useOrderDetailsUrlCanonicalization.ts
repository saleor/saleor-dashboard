import { type OrderStatus } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { parseQs } from "@dashboard/url-utils";
import { useEffect } from "react";
import { useLocation } from "react-router";
import { matchPath } from "react-router-dom";

import { orderDetailsUrl, orderDraftPath, orderPath, type OrderUrlQueryParams } from "../urls";

export const useOrderDetailsUrlCanonicalization = (
  orderId: string,
  orderStatus: OrderStatus | undefined,
) => {
  const navigate = useNavigator();
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (!orderStatus) {
      return;
    }

    const isOrderDetailsRoute =
      !!matchPath(pathname, { path: orderPath(":id"), exact: true }) ||
      !!matchPath(pathname, { path: orderDraftPath(":id"), exact: true });

    if (!isOrderDetailsRoute) {
      return;
    }

    const params = parseQs(search.substr(1)) as OrderUrlQueryParams;
    const canonicalUrl = orderDetailsUrl(orderId, params, orderStatus);

    if (pathname !== canonicalUrl.split("?")[0]) {
      navigate(canonicalUrl, { replace: true });
    }
  }, [navigate, orderId, orderStatus, pathname, search]);
};
