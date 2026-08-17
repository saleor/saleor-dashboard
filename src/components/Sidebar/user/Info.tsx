import { useUser } from "@dashboard/auth/useUser";
import { savebarHeight } from "@dashboard/components/AppLayout/consts";
import { UserAvatar } from "@dashboard/components/UserAvatar";
import { getUserInitials, getUserName } from "@dashboard/misc";
import { Box, Text } from "@saleor/macaw-ui-next";

import { UserControls } from "./Controls";

export const UserInfo = () => {
  const { user } = useUser();

  return (
    <Box
      display="flex"
      gap={3}
      paddingX={3}
      alignItems="center"
      borderTopWidth={1}
      borderColor="default1"
      borderTopStyle="solid"
      justifyContent="space-between"
      // Match savebarHeight so this hairline meets the save bar across the sidebar edge.
      __height={savebarHeight}
    >
      <Box display="flex" gap={3} alignItems="center">
        <UserAvatar initials={getUserInitials(user!)} url={user?.avatar?.url} />
        <Box __width={128} className="ellipsis">
          <Text size={3} fontWeight="bold">
            {getUserName(user!, true)}
          </Text>
        </Box>
      </Box>
      <UserControls />
    </Box>
  );
};
