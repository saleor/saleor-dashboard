import { useUser } from "@dashboard/auth";
import { UserAvatar } from "@dashboard/components/UserAvatar";
import { getUserInitials, getUserName } from "@dashboard/misc";
import { Box, Text } from "@saleor/macaw-ui/next";
import React from "react";

import { UserControls } from "./Controls";

export const UserInfo = () => {
  const { user } = useUser();

  return (
    <Box
      display="flex"
      gap="s3"
      paddingX="s3"
      paddingY="s4"
      alignItems="center"
      borderTopWidth={1}
      borderColor="neutralPlain"
      borderTopStyle="solid"
      justifyContent="space-between"
    >
      <Box display="flex" gap="s3" alignItems="center">
        <UserAvatar initials={getUserInitials(user)} url={user?.avatar?.url} />
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
