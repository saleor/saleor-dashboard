import { SortableTree } from "@dashboard/components/SortableTree";
import { MenuTreeItem, RecursiveMenuItem } from "@dashboard/navigation/types";
import { UniqueIdentifier } from "@dnd-kit/core";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { MenuItemType } from "../MenuItemDialog";
import { MenuItemsSortableTreeItem } from "./MenuItemsSortableTreeItem";
import { getNodeData } from "./utils";

interface MenuItemsSortableTreeProps {
  items: RecursiveMenuItem[];
  onChange: (newTree: MenuTreeItem[]) => void;
  onItemClick: (id: UniqueIdentifier, type: MenuItemType) => void;
  onItemEdit: (id: UniqueIdentifier) => void;
  onItemRemove: (id: UniqueIdentifier) => void;
}

export const MenuItemsSortableTree = ({
  items,
  onItemClick,
  onItemEdit,
  onItemRemove,
  onChange,
}: MenuItemsSortableTreeProps) => {
  if (!items.length) {
    return (
      <Box
        backgroundColor="default1"
        paddingBottom={3}
        borderColor="default1"
        borderBottomWidth={1}
        borderBottomStyle="solid"
      >
        <Text>
          <FormattedMessage id="WwZfNK" defaultMessage="Add new menu item to begin creating menu" />
        </Text>
      </Box>
    );
  }

  return (
    <SortableTree
      onChange={onChange}
      items={items.map(getNodeData)}
      renderTreeItem={props => (
        <MenuItemsSortableTreeItem
          {...props}
          onRemove={onItemRemove}
          onClick={onItemClick}
          onEdit={onItemEdit}
        />
      )}
    />
  );
};
