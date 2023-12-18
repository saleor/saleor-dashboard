import { MenuItem, SubMenu } from "@dashboard/components/SubMenu";
import {
  ArrowDownIcon,
  Box,
  Button,
  PlusIcon,
  Popover,
  ProductsIcons,
} from "@saleor/macaw-ui-next";
import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { messages } from "../../messages";

interface AddButtonProps {
  disabled?: boolean;
  onCatalogClick: () => void;
}

export const AddButton = ({
  onCatalogClick,
  disabled = false,
}: AddButtonProps) => {
  const intl = useIntl();
  const [isSubMenuOpen, setSubMenuOpen] = useState(false);

  const handleCatalogClick = () => {
    onCatalogClick();
    setSubMenuOpen(false);
  };

  const subMenuItems = useMemo<MenuItem[]>(
    () => [
      {
        id: "catalog",
        title: intl.formatMessage(messages.catalog),
        description: intl.formatMessage(messages.catalogDescription),
        icon: <ProductsIcons />,
        onClick: handleCatalogClick,
      },
    ],
    [],
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
