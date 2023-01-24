import { useUser } from "@dashboard/auth";
import { Box, List, sprinkles, Text } from "@saleor/macaw-ui/next";
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
