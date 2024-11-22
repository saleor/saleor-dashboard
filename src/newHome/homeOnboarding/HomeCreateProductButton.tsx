import { useUser } from "@dashboard/auth";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { productListUrl } from "@dashboard/products/urls";
import { Button, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { HomeFakeDisabledButton } from "./HomeFakeDisabledButton";

export const HomeCreateProductButton = () => {
  const { user } = useUser();
  const userPermissions = user?.userPermissions || [];
  const hasPermissionToManageProducts = hasPermissions(userPermissions, [
    PermissionEnum.MANAGE_PRODUCTS,
  ]);

  if (!hasPermissionToManageProducts) {
    return (
      <Tooltip>
        <Tooltip.Trigger>
          <HomeFakeDisabledButton>
            <FormattedMessage
              defaultMessage="Go to all products"
              id="XZpRr8"
              description="btn label"
            />
          </HomeFakeDisabledButton>
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

  const goToAllProductsUrl = productListUrl();

  return (
    <Button
      as="a"
      href={goToAllProductsUrl}
      target="_blank"
      rel="noreferrer noopener"
      variant="primary"
    >
      <FormattedMessage defaultMessage="Go to all products" id="XZpRr8" description="btn label" />
    </Button>
  );
};
