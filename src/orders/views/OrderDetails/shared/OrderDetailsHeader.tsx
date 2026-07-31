import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { mapExtensionMenuItemsToTopNavItems } from "@dashboard/components/AppLayout/TopNav/mapExtensionMenuItems";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemsForOrderDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { type OrderDetailsFragment, OrderStatus } from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { GraphqlIcon } from "@dashboard/icons/GraphqlIcon";
import { defaultGraphiQLQuery } from "@dashboard/orders/queries";
import { rippleOrderMetadata } from "@dashboard/orders/ripples/orderMetadata";
import { orderListUrl } from "@dashboard/orders/urls";
import { Trash2 } from "lucide-react";
import { type ReactElement, useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { messages } from "../../../components/OrderPageShared/messages";
import Title from "../../../components/OrderPageShared/Title";

interface OrderDetailsHeaderProps {
  order: OrderDetailsFragment;
  onShowMetadata: () => void;
  onCancel: () => void;
}

/**
 * Order details top bar: title, metadata button and the more-actions menu.
 *
 * Owns the app-extension menu items, the GraphiQL playground entry and the
 * back link, so no lifecycle view assembles those itself.
 */
export const OrderDetailsHeader = ({
  order,
  onShowMetadata,
  onCancel,
}: OrderDetailsHeaderProps): ReactElement => {
  const intl = useIntl();
  const devMode = useDevModeContext();
  const { ORDER_DETAILS_MORE_ACTIONS } = useExtensions(extensionMountPoints.ORDER_DETAILS);
  const extensionMenuItems = getExtensionsItemsForOrderDetails(
    ORDER_DETAILS_MORE_ACTIONS,
    order.id,
  );
  const backLinkUrl = useBackLinkWithState({ path: orderListUrl() });
  const canCancel = order.status !== OrderStatus.CANCELED;
  const openPlaygroundURL = useCallback(() => {
    devMode.setDevModeContent(defaultGraphiQLQuery);
    devMode.setVariables(`{ "id": "${order.id}" }`);
    devMode.setDevModeVisibility(true);
  }, [devMode, order.id]);
  const menuItems = useMemo(
    () => [
      ...mapExtensionMenuItemsToTopNavItems(extensionMenuItems),
      {
        label: intl.formatMessage(messages.openGraphiQL),
        onSelect: openPlaygroundURL,
        testId: "graphiql-redirect",
        icon: <GraphqlIcon />,
      },
      ...(canCancel
        ? [
            {
              label: intl.formatMessage(messages.cancelOrder),
              onSelect: onCancel,
              testId: "cancel-order",
              color: "critical1" as const,
              icon: <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
            },
          ]
        : []),
    ],
    [canCancel, extensionMenuItems, intl, onCancel, openPlaygroundURL],
  );

  return (
    <TopNav href={backLinkUrl} title={<Title order={order} />} actionsGap={3}>
      <TopNav.MetadataButton
        onClick={onShowMetadata}
        data-test-id="show-order-metadata"
        title={intl.formatMessage(messages.editOrderMetadata)}
        ripple={rippleOrderMetadata}
      />

      <TopNav.Menu dataTestId="menu" items={menuItems} />
    </TopNav>
  );
};
