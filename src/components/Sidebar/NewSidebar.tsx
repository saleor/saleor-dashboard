import { useUser } from "@dashboard/auth";
import { Box, List, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import useMenuStructure from "./useMenuStructure";

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
    >
      <List as="ol">
        {menuStructure.map(menuItem => (
          <Link to={menuItem.url} key={menuItem.id}>
            <List.Item paddingX={4} paddingY={4} gap={5} borderRadius={3}>
              {menuItem.icon}
              <Text>{menuItem.label}</Text>
            </List.Item>
          </Link>
        ))}
      </List>
    </Box>
  );
};
