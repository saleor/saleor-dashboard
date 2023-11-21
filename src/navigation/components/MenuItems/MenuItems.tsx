// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import Skeleton from "@dashboard/components/Skeleton";
import { buttonMessages } from "@dashboard/intl";
import { RecursiveMenuItem } from "@dashboard/navigation/types";
import { Box, Button } from "@saleor/macaw-ui-next";
import React, { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { MenuItemType } from "../MenuItemDialog";
import { MenuItemsSortableTree } from "../MenuItemsSortableTree";
import { getNodeData } from "../MenuItemsSortableTree/utils";
import { getDiff, TreeOperation } from "./tree";

export interface MenuItemsProps {
  canUndo: boolean;
  items: RecursiveMenuItem[];
  onChange: (operations: TreeOperation[]) => void;
  onItemAdd: () => void;
  onItemClick: (id: string, type: MenuItemType) => void;
  onItemEdit: (id: string) => void;
  onUndo: () => void;
}

const MenuItems: React.FC<MenuItemsProps> = props => {
  const {
    canUndo,
    items,
    onChange,
    onItemAdd,
    onItemClick,
    onItemEdit,
    onUndo,
  } = props;
  const intl = useIntl();
  const currentTree = useMemo(() => items.map(getNodeData), [items]);

  return (
    <DashboardCard>
      <DashboardCard.Title>
        <Box display="flex" justifyContent="space-between">
          {intl.formatMessage({
            id: "dEUZg2",
            defaultMessage: "Menu Items",
            description: "header",
          })}
          <Button disabled={!canUndo} onClick={onUndo}>
            <FormattedMessage {...buttonMessages.undo} />
          </Button>
        </Box>
      </DashboardCard.Title>
      <DashboardCard.Content>
        <Box backgroundColor="surfaceNeutralHighlight" marginBottom={4}>
          {items === undefined ? (
            <Skeleton />
          ) : (
            <MenuItemsSortableTree
              items={items}
              onChange={newTree => onChange(getDiff(currentTree, newTree))}
              onItemRemove={id =>
                onChange([{ id: id.toString(), type: "remove" }])
              }
              onItemClick={onItemClick}
              onItemEdit={onItemEdit}
            />
          )}
        </Box>

        <Button
          onClick={onItemAdd}
          variant="secondary"
          data-test-id="create-new-menu-item"
        >
          <FormattedMessage
            id="Uf3oHA"
            defaultMessage="Create new item"
            description="add new menu item"
          />
        </Button>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
MenuItems.displayName = "MenuItems";
export default MenuItems;
