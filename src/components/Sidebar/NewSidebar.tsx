import { Box, List, sprinkles, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { Link } from "react-router-dom";

import { MenuItem, useMenuStructure } from "./useMenuStructure";
import { isMenuActive } from "./utils";

export const NewSidebar = () => {
  const [menuStructure, handleMenuItemClick] = useMenuStructure();
  const activeMenu = menuStructure.find(menuItem =>
    isMenuActive(location.pathname, menuItem),
  )?.id;

  return (
    <Box
      backgroundColor="subdued"
      as="aside"
      padding={5}
      borderColor="neutralPlain"
      borderRightWidth={1}
      borderRightStyle="solid"
      __minWidth="250px"
    >
      <List as="ol">
        {menuStructure.map(menuItem => (
          <MenuItem
            menuItem={menuItem}
            activeMenu={activeMenu}
            handleMenuItemClick={handleMenuItemClick}
            key={menuItem.id}
          />
        ))}
      </List>
    </Box>
  );
};

const ItemGroup = ({
  menuItem,
  activeMenu,
  handleMenuItemClick,
}: {
  menuItem: MenuItem;
  activeMenu: string;
  handleMenuItemClick: (id: string) => void;
}) => (
  <List.ItemGroup>
    <List.ItemGroup.Trigger
      paddingX={4}
      paddingY={4}
      borderRadius={3}
      justifyContent="space-between"
      active={activeMenu === menuItem.id}
    >
      <Box display="flex" alignItems="center" gap={5}>
        {menuItem.icon}
        <Text>{menuItem.label}</Text>
      </Box>
    </List.ItemGroup.Trigger>
    <List.ItemGroup.Content>
      <Box
        borderLeftWidth={1}
        borderLeftStyle="solid"
        borderColor="neutralPlain"
        __paddingLeft="18px"
        __marginLeft="18px"
      >
        {menuItem.children?.map(child => (
          <MenuItem
            menuItem={child}
            key={child.id}
            activeMenu={""}
            handleMenuItemClick={handleMenuItemClick}
          />
        ))}
      </Box>
    </List.ItemGroup.Content>
  </List.ItemGroup>
);

const Item = ({
  menuItem,
  activeMenu,
  handleMenuItemClick,
}: {
  menuItem: MenuItem;
  activeMenu: string;
  handleMenuItemClick: (id: string) => void;
}) => (
  <List.Item
    borderRadius={3}
    active={activeMenu === menuItem.id}
    onClick={() => handleMenuItemClick(menuItem.id)}
  >
    <Link
      to={menuItem.url}
      className={sprinkles({
        padding: 4,
        display: "block",
        width: "100%",
      })}
    >
      <Box display="flex" alignItems="center" gap={5}>
        {menuItem.icon}
        <Text>{menuItem.label}</Text>
      </Box>
    </Link>
  </List.Item>
);

const Divider = ({ menuItem }: { menuItem: MenuItem }) => (
  <List.Divider paddingX={4} paddingY={4}>
    <Text variant="caption" size="small" color="textNeutralSubdued">
      {menuItem.label}
    </Text>
  </List.Divider>
);

const MenuItem = ({
  menuItem,
  activeMenu,
  handleMenuItemClick,
}: {
  menuItem: MenuItem;
  activeMenu: string;
  handleMenuItemClick: (id: string) => void;
}) => {
  switch (menuItem.type) {
    case "item":
      return (
        <Item
          menuItem={menuItem}
          activeMenu={activeMenu}
          handleMenuItemClick={handleMenuItemClick}
        />
      );
    case "itemGroup":
      return (
        <ItemGroup
          menuItem={menuItem}
          activeMenu={activeMenu}
          handleMenuItemClick={handleMenuItemClick}
        />
      );
    case "divider":
      return <Divider menuItem={menuItem} />;
  }
};
