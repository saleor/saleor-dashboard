import { useUser } from "@dashboard/auth";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { orderListUrl } from "@dashboard/orders/urls";
import { Button, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { HomeFakeDisabledButton } from "./HomeFakeDisabledButton";

export const HomeOrdersButton = () => {
  const { user } = useUser();
  const userPermissions = user?.userPermissions || [];
  const hasPermissionToManageOrders = hasPermissions(userPermissions, [
    PermissionEnum.MANAGE_ORDERS,
  ]);

  if (!hasPermissionToManageOrders) {
    return (
      <Tooltip>
        <Tooltip.Trigger>
          <HomeFakeDisabledButton>
            <FormattedMessage defaultMessage="Go to orders" id="kv3FWU" description="btn label" />
          </HomeFakeDisabledButton>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <Tooltip.Arrow />
          <FormattedMessage
            defaultMessage="You don't have permission to manage orders"
            id="xol6jX"
          />
        </Tooltip.Content>
      </Tooltip>
    );
  }

  const goToOrdersUrl = orderListUrl();

  return (
    <Button as="a" href={goToOrdersUrl} target="_blank" rel="noreferrer noopener" variant="primary">
      <FormattedMessage defaultMessage="Go to orders" id="kv3FWU" description="btn label" />
    </Button>
  );
};
