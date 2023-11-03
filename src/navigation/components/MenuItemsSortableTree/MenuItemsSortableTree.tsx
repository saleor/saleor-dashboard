import { SortableTree } from "@dashboard/components/SortableTree";
import { RecursiveMenuItem } from "@dashboard/navigation/types";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { MenuItemType } from "../MenuItemDialog";
import { MenuItemsSortableTreeItem } from "./MenuItemsSortableTreeItem";
import { getNodeData } from "./utils";

interface MenuItemsSortableTreeProps {
  items: RecursiveMenuItem[];
  onItemClick: (id: string, type: MenuItemType) => void;
  onItemEdit: (id: string) => void;
}

export const MenuItemsSortableTree = ({
  items,
  onItemClick,
  onItemEdit,
}: MenuItemsSortableTreeProps) => {
  if (!items.length) {
    return (
      <Box
        backgroundColor="surfaceNeutralPlain"
        paddingBottom={3}
        borderColor="neutralPlain"
        borderBottomWidth={1}
        borderBottomStyle="solid"
      >
        <Text>
          <FormattedMessage
            id="WwZfNK"
            defaultMessage="Add new menu item to begin creating menu"
          />
        </Text>
      </Box>
    );
  }

  return (
    <SortableTree
      items={items.map(getNodeData)}
      renderTreeItem={props => (
        <MenuItemsSortableTreeItem
          {...props}
          onClick={onItemClick}
          onEdit={onItemEdit}
        />
      )}
    />
  );
};
