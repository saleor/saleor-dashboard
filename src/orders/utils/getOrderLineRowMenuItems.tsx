import { type TopNavMenuItem } from "@dashboard/components/AppLayout/TopNav/Menu";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { type OrderDetailsFragment } from "@dashboard/graphql";
import { messages } from "@dashboard/orders/components/OrderLineRowActions/messages";
import {
  getOrderLineFulfillUrl,
  getOrderLineReturnUrl,
  type OrderLineRowMenuContext,
  shouldOfferLineFulfillAction,
  shouldOfferLineReturnAction,
} from "@dashboard/orders/utils/getOrderLineActionUrls";
import { getOrderRefundNavigation } from "@dashboard/orders/utils/getOrderRefundNavigation";
import { productPath } from "@dashboard/products/urls";
import { ExternalLink, PackageIcon, Undo2 } from "lucide-react";
import { type IntlShape } from "react-intl";

import { RefundedIcon } from "../../icons/RefundedIcon";

interface GetOrderLineRowMenuItemsParams {
  order: OrderDetailsFragment;
  lineId: string | undefined;
  productId: string | undefined;
  intl: IntlShape;
  navigate: (url: string) => void;
  context?: OrderLineRowMenuContext;
}

export const getOrderLineRowMenuItems = ({
  order,
  lineId,
  productId,
  intl,
  navigate,
  context,
}: GetOrderLineRowMenuItemsParams): TopNavMenuItem[] => {
  const items: TopNavMenuItem[] = [
    {
      label: intl.formatMessage(messages.productDetails),
      testId: "order-line-product-details",
      disabled: !productId,
      icon: <ExternalLink size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
      onSelect: () => {
        if (productId) {
          window.open(productPath(productId), "_blank", "noopener,noreferrer");
        }
      },
    },
  ];

  if (lineId && shouldOfferLineFulfillAction(order, lineId, context)) {
    items.push({
      label: intl.formatMessage(messages.fulfillLine),
      testId: "order-line-fulfill",
      icon: <PackageIcon size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
      onSelect: () => {
        navigate(getOrderLineFulfillUrl(order.id, lineId));
      },
    });
  }

  if (lineId && shouldOfferLineReturnAction(order, lineId, context)) {
    items.push({
      label: intl.formatMessage(messages.returnLine),
      testId: "order-line-return",
      icon: <Undo2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
      onSelect: () => {
        navigate(getOrderLineReturnUrl(order.id, lineId));
      },
    });
  }

  if (lineId) {
    const refundNavigation = getOrderRefundNavigation(order, { lineId });

    if (refundNavigation.canRefund) {
      items.push({
        label: intl.formatMessage(messages.refundLine),
        testId: "order-line-refund",
        icon: <RefundedIcon size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
        onSelect: () => {
          navigate(refundNavigation.url);
        },
      });
    }
  }

  return items;
};
