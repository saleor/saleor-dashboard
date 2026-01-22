import { useUser } from "@dashboard/auth";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";

import { WelcomePageOnboarding } from "./WelcomePageOnboarding";
import { WelcomePageSidebar } from "./WelcomePageSidebar";
import { WelcomePageTilesContainer } from "./WelcomePageTilesContainer";
import { WelcomePageTitle } from "./WelcomePageTitle";

export const WelcomePage = () => {
  const { channel, setChannel } = useAppChannel(false);
  const { user } = useUser();
  const channels = user?.accessibleChannels ?? [];
  const userPermissions = user?.userPermissions || [];
  const hasPermissionToManageOrders = hasPermissions(userPermissions, [
    PermissionEnum.MANAGE_ORDERS,
  ]);

  return (
    <Box
      display="grid"
      gap={7}
      gridTemplateColumns={{
        mobile: 1,
        tablet: 1,
        desktop: 3,
      }}
      paddingX={8}
      paddingY={6}
      paddingTop={9}
      __gridTemplateRows="auto 1fr"
    >
      <Box gridRowStart="1" __grid-column="1/-1">
        <WelcomePageTitle />
      </Box>
      <Box
        gridColumn={{
          mobile: "1",
          tablet: "1",
          desktop: "2",
        }}
      >
        <WelcomePageOnboarding />
        <WelcomePageTilesContainer />
      </Box>
      <Box gridColumn="1">
        <WelcomePageSidebar
          channel={channel}
          setChannel={setChannel}
          channels={channels}
          hasPermissionToManageOrders={hasPermissionToManageOrders}
        />
      </Box>
    </Box>
  );
};
