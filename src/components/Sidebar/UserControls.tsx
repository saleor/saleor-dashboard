import { useUser } from "@dashboard/auth";
import { getUserInitials, getUserName } from "@dashboard/misc";
import { Avatar, Box, MoreOptionsIcon, Text } from "@saleor/macaw-ui/next";
import React from "react";

export const UserControls = () => {
  const { user } = useUser();

  return (
    <Box
      display="flex"
      gap={5}
      paddingX={6}
      paddingY={7}
      alignItems="center"
      borderTopWidth={1}
      borderColor="neutralPlain"
      borderTopStyle="solid"
      justifyContent="space-between"
    >
      <Box display="flex" gap={5} alignItems="center">
        <Avatar.User
          initials={getUserInitials(user)}
          scheme="decorative2"
          src={user?.avatar?.url}
        />
        <Text variant="bodyEmp" size="medium">
          {getUserName(user, true)}
        </Text>
      </Box>
      <Box cursor="pointer" display="flex" justifyContent="center">
        <MoreOptionsIcon />
      </Box>
    </Box>
  );
};
