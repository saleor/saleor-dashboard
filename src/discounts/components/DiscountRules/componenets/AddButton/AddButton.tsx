import { MenuItem, SubMenu } from "@dashboard/components/SubMenu";
import { DiscountType } from "@dashboard/discounts/types";
import {
  ArrowDownIcon,
  Box,
  Button,
  OrdersIcon,
  PlusIcon,
  Popover,
  ProductsIcons,
} from "@saleor/macaw-ui-next";
import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { messages } from "../../messages";
import { byDiscountType } from "./filter";

interface AddButtonProps {
  disabled?: boolean;
  discountType: DiscountType;
  onCatalogClick: () => void;
  onOrderClick: () => void;
}

export const AddButton = ({
  discountType,
  onCatalogClick,
  onOrderClick,
  disabled = false,
}: AddButtonProps) => {
  const intl = useIntl();
  const [isSubMenuOpen, setSubMenuOpen] = useState(false);

  const handleCatalogClick = () => {
    onCatalogClick();
    setSubMenuOpen(false);
  };

  const handleOrderClick = () => {
    onOrderClick();
    setSubMenuOpen(false);
  };

  const subMenuItems = useMemo<MenuItem[]>(
    () =>
      [
        {
          id: "catalog",
          title: intl.formatMessage(messages.catalog),
          description: intl.formatMessage(messages.catalogDescription),
          icon: <ProductsIcons />,
          onClick: handleCatalogClick,
        },
        {
          id: "order",
          title: intl.formatMessage(messages.checkoutAndOrders),
          description: intl.formatMessage(
            messages.checkoutAndOrdersDescription,
          ),
          icon: <OrdersIcon />,
          onClick: handleOrderClick,
        },
      ].filter(byDiscountType(discountType)),
    [discountType],
  );

  return (
    <Popover open={isSubMenuOpen} onOpenChange={setSubMenuOpen}>
      <Popover.Trigger>
        <Button type="button" disabled={disabled} variant="primary">
          <PlusIcon />
          {intl.formatMessage(messages.addRule)}
          <ArrowDownIcon />
        </Button>
      </Popover.Trigger>
      <Popover.Content align="end">
        <Box marginTop={1}>
          <SubMenu menuItems={subMenuItems} />
        </Box>
      </Popover.Content>
    </Popover>
  );
};
