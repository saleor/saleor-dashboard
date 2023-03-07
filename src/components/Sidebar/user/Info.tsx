import { useUser } from "@dashboard/auth";
import { getUserInitials, getUserName } from "@dashboard/misc";
import { Avatar, Box, Text } from "@saleor/macaw-ui/next";
import React from "react";

import { UserControls } from "./Controls";

export const UserInfo = () => {
  const { user } = useUser();

  return (
    <Box
      display="flex"
      gap={6}
      paddingX={6}
      paddingY={7}
      alignItems="center"
      borderTopWidth={1}
      borderColor="neutralPlain"
      borderTopStyle="solid"
      justifyContent="space-between"
    >
      <Box display="flex" gap={6} alignItems="center">
        {user?.avatar?.url ? (
          <Avatar.User scheme="decorative3" src={user?.avatar?.url} />
        ) : (
          <Avatar.User initials={getUserInitials(user)} scheme="decorative3" />
        )}
        <Box __width={128} className="ellipsis">
          <Text variant="bodyStrong" size="small">
            {getUserName(user, true)}
          </Text>
        </Box>
      </Box>
      <UserControls />
    </Box>
  );
};
