import { orderDraftListPath, orderListUrl as getOrderListUrl } from "@dashboard/orders/urls";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import urljoin from "url-join";

type LocationWithState = Location & {
  state?: {
    prevLocation?: Location;
  };
};

const getPreviousUrl = (location: LocationWithState) => {
  if (!location.state?.prevLocation) {
    return null;
  }

  const { pathname, search } = location.state.prevLocation;

  return urljoin(pathname, search);
};

const orderListUrl = getOrderListUrl();
const draftOrderListUrl = orderDraftListPath;

export const useOrderListBackLink = () => {
  const location = useLocation();
  const [backLink, setBackLink] = useState<string | null>(null);

  useEffect(() => {
    if (location.state) {
      const previousUrl = getPreviousUrl(location as LocationWithState);

      // Prevent other links from being set as back link
      // it should accept '/orders/' and '/order/drafts/' with query params
      const isOrderListPath =
        previousUrl?.includes(orderListUrl) || previousUrl?.includes(draftOrderListUrl);

      if (isOrderListPath) {
        setBackLink(previousUrl);
      }
    }
  }, [location]);

  return backLink;
};
