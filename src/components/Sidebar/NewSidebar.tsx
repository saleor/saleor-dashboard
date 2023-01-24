import { useUser } from "@dashboard/auth";
import { Box, List, sprinkles, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import useMenuStructure, { FilterableMenuItem } from "./useMenuStructure";

export const NewSidebar = () => {
  const intl = useIntl();
  const { user } = useUser();
  const [menuStructure] = useMenuStructure(intl, user);

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
          <List.Item borderRadius={3} key={menuItem.id}>
            <Link
              to={menuItem.url}
              className={sprinkles({
                padding: 4,
              })}
            >
              <Box display="flex" alignItems="center" gap={5}>
                {menuItem.icon}
                <Text>{menuItem.label}</Text>
              </Box>
            </Link>
          </List.Item>
        ))}
      </List>
    </Box>
  );
};

const SidebarItem = ({ menuItem }: { menuItem: FilterableMenuItem }) =>
  menuItem.children ? (
    <List.ItemGroup>
      <List.ItemGroup.Trigger
        paddingX={4}
        paddingY={4}
        borderRadius={3}
        justifyContent="space-between"
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
          {menuItem.children.map(child => (
            <SubMenuItem menuItem={child} key={child.id} />
          ))}
        </Box>
      </List.ItemGroup.Content>
    </List.ItemGroup>
  ) : (
    <Item menuItem={menuItem} />
  );

const Item = ({ menuItem }: { menuItem: FilterableMenuItem }) => (
  <List.Item paddingX={4} paddingY={4} gap={5} borderRadius={3}>
    {menuItem.icon}
    <Text>{menuItem.label}</Text>
  </List.Item>
);

const SubMenuItem = ({ menuItem }: { menuItem: FilterableMenuItem }) => {
  if (menuItem.children || menuItem.url) {
    return <Item menuItem={menuItem} />;
  }

  return (
    <List.Divider paddingX={4} paddingY={4}>
      <Text variant="caption" size="small" color="textNeutralSubdued">
        {menuItem.label}
      </Text>
    </List.Divider>
  );
};
