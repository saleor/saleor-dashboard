import { useUser } from "@dashboard/auth";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { productListUrl } from "@dashboard/products/urls";
import { Button, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { PrimaryActionProps } from "./type";
import { WelcomePageFakeDisabledButton } from "./WelcomePageFakeDisabledButton";

export const WelcomePageCreateProductButton = ({ onClick }: PrimaryActionProps) => {
  const { user } = useUser();
  const userPermissions = user?.userPermissions || [];
  const hasPermissionToManageProducts = hasPermissions(userPermissions, [
    PermissionEnum.MANAGE_PRODUCTS,
  ]);

  if (!hasPermissionToManageProducts) {
    return (
      <Tooltip>
        <Tooltip.Trigger>
          <WelcomePageFakeDisabledButton>
            <FormattedMessage
              defaultMessage="Go to all products"
              id="XZpRr8"
              description="btn label"
            />
          </WelcomePageFakeDisabledButton>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <Tooltip.Arrow />
          <FormattedMessage
            defaultMessage="You don't have permission to manage products"
            id="KHI/qv"
          />
        </Tooltip.Content>
      </Tooltip>
    );
  }

  return (
    <Link to={productListUrl()} onClick={onClick}>
      <Button variant="primary">
        <FormattedMessage defaultMessage="Go to all products" id="XZpRr8" description="btn label" />
      </Button>
    </Link>
  );
};
