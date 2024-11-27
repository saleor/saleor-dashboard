import { useUser } from "@dashboard/auth";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { orderListUrl } from "@dashboard/orders/urls";
import { Button, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { WelcomePageFakeDisabledButton } from "./WelcomePageFakeDisabledButton";

export const WelcomePageOrdersButton = () => {
  const { user } = useUser();
  const userPermissions = user?.userPermissions || [];
  const hasPermissionToManageOrders = hasPermissions(userPermissions, [
    PermissionEnum.MANAGE_ORDERS,
  ]);

  if (!hasPermissionToManageOrders) {
    return (
      <Tooltip>
        <Tooltip.Trigger>
          <WelcomePageFakeDisabledButton>
            <FormattedMessage defaultMessage="Go to orders" id="kv3FWU" description="btn label" />
          </WelcomePageFakeDisabledButton>
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

  return (
    <Link to={orderListUrl()}>
      <Button variant="primary">
        <FormattedMessage defaultMessage="Go to orders" id="kv3FWU" description="btn label" />
      </Button>
    </Link>
  );
};
