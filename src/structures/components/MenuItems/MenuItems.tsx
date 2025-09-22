// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { buttonMessages } from "@dashboard/intl";
import { RecursiveMenuItem } from "@dashboard/structures/types";
import { Box, Button, Skeleton } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { MenuItemType } from "../MenuItemDialog";
import { MenuItemsSortableTree } from "../MenuItemsSortableTree";
import { getNodeData } from "../MenuItemsSortableTree/utils";
import { getDiff, TreeOperation } from "./tree";

interface MenuItemsProps {
  canUndo: boolean;
  items: RecursiveMenuItem[];
  onChange: (operations: TreeOperation[]) => void;
  onItemAdd: () => void;
  onItemClick: (id: string, type: MenuItemType) => void;
  onItemEdit: (id: string) => void;
  // If not passed, it will not render the button. Use to control permissions
  onTranslate?: (id: string) => void;
  onUndo: () => void;
}

const MenuItems = (props: MenuItemsProps) => {
  const { canUndo, items, onChange, onItemAdd, onItemClick, onItemEdit, onUndo, onTranslate } =
    props;
  const intl = useIntl();
  const currentTree = useMemo(() => items.map(getNodeData), [items]);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          <Box display="flex" justifyContent="space-between">
            {intl.formatMessage({
              id: "TD/GhR",
              defaultMessage: "Structure Items",
              description: "header",
            })}
          </Box>
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          <Button disabled={!canUndo} onClick={onUndo} data-test-id="undo-button">
            <FormattedMessage {...buttonMessages.undo} />
          </Button>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Box data-test-id="menu-items-list" backgroundColor="default1" marginBottom={4}>
          {items === undefined ? (
            <Skeleton />
          ) : (
            <MenuItemsSortableTree
              items={items}
              onChange={newTree => onChange(getDiff(currentTree, newTree))}
              onItemRemove={id => onChange([{ id: id.toString(), type: "remove" }])}
              onItemClick={onItemClick}
              onItemEdit={onItemEdit}
              onTranslate={onTranslate}
            />
          )}
        </Box>

        <Button onClick={onItemAdd} variant="secondary" data-test-id="create-new-menu-item">
          <FormattedMessage
            id="XvbjyW"
            defaultMessage="Create new item"
            description="add new structure"
          />
        </Button>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

MenuItems.displayName = "MenuItems";
export default MenuItems;
