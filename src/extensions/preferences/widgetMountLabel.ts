import { collectionListUrl } from "@dashboard/collections/urls";
import { customerListUrl } from "@dashboard/customers/urls";
import { voucherListUrl } from "@dashboard/discounts/urls";
import { WIDGET_AVAILABLE_MOUNTS } from "@dashboard/extensions/domain/app-extension-manifest-available-mounts";
import { giftCardListUrl } from "@dashboard/giftCards/urls";
import { homeUrl } from "@dashboard/home/urls";
import { orderDraftListUrl, orderListUrl } from "@dashboard/orders/urls";
import { productListUrl } from "@dashboard/products/urls";
import { type MessageDescriptor } from "react-intl";

type WidgetMount = (typeof WIDGET_AVAILABLE_MOUNTS)[number];

export const widgetMountMessages: Record<WidgetMount, MessageDescriptor> = {
  HOMEPAGE_WIDGETS: {
    id: "/q6akQ",
    defaultMessage: "Home",
    description: "widget location: homepage",
  },
  ORDER_DETAILS_WIDGETS: {
    id: "ViVioG",
    defaultMessage: "Order details",
    description: "widget location: order details",
  },
  DRAFT_ORDER_DETAILS_WIDGETS: {
    id: "q/NLXo",
    defaultMessage: "Draft order details",
    description: "widget location: draft order details",
  },
  PRODUCT_DETAILS_WIDGETS: {
    id: "lAJGYp",
    defaultMessage: "Product details",
    description: "widget location: product details",
  },
  CUSTOMER_DETAILS_WIDGETS: {
    id: "WI8eoO",
    defaultMessage: "Customer details",
    description: "widget location: customer details",
  },
  COLLECTION_DETAILS_WIDGETS: {
    id: "R1lwlR",
    defaultMessage: "Collection details",
    description: "widget location: collection details",
  },
  VOUCHER_DETAILS_WIDGETS: {
    id: "bEX/N4",
    defaultMessage: "Voucher details",
    description: "widget location: voucher details",
  },
  GIFT_CARD_DETAILS_WIDGETS: {
    id: "6Re+aE",
    defaultMessage: "Gift card details",
    description: "widget location: gift card details",
  },
};

export const isWidgetMount = (mountName: string): mountName is WidgetMount =>
  (WIDGET_AVAILABLE_MOUNTS as readonly string[]).includes(mountName);

const widgetMountPaths: Record<WidgetMount, string> = {
  HOMEPAGE_WIDGETS: homeUrl(),
  ORDER_DETAILS_WIDGETS: orderListUrl(),
  DRAFT_ORDER_DETAILS_WIDGETS: orderDraftListUrl(),
  PRODUCT_DETAILS_WIDGETS: productListUrl(),
  CUSTOMER_DETAILS_WIDGETS: customerListUrl(),
  COLLECTION_DETAILS_WIDGETS: collectionListUrl(),
  VOUCHER_DETAILS_WIDGETS: voucherListUrl(),
  GIFT_CARD_DETAILS_WIDGETS: giftCardListUrl(),
};

/** Closest dashboard list/home for a widget mount — detail widgets have no single entity. */
export const getWidgetLocationHref = (mountName: string): string | undefined => {
  if (!isWidgetMount(mountName)) {
    return undefined;
  }

  return widgetMountPaths[mountName];
};
