import { useUser } from "@dashboard/auth/useUser";
import { savebarHeight } from "@dashboard/components/AppLayout/consts";
import { UserAvatar } from "@dashboard/components/UserAvatar/UserAvatar";
import { getUserInitials, getUserName } from "@dashboard/misc";
import { Box, Text } from "@saleor/macaw-ui-next";

import { UserControls } from "./Controls";

export const UserInfo = ({ collapsed = false }: { collapsed?: boolean }) => {
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
      justifyContent={collapsed ? "center" : "space-between"}
      // Match savebarHeight so this hairline meets the save bar across the sidebar edge.
      __height={savebarHeight}
    >
      {!collapsed && (
        <Box display="flex" gap={3} alignItems="center" minWidth={0} flexGrow="1">
          <Box flexShrink="0">
            <UserAvatar initials={getUserInitials(user!)} url={user?.avatar?.url} />
          </Box>
          <Box minWidth={0} className="ellipsis">
            <Text size={3} fontWeight="bold">
              {getUserName(user!, true)}
            </Text>
          </Box>
        </Box>
      )}
      <UserControls collapsed={collapsed} />
    </Box>
  );
};
