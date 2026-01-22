import { useUser } from "@dashboard/auth";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { Box, Button } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { WelcomePageOnboarding } from "./WelcomePageOnboarding";
import { WelcomePageSidebar } from "./WelcomePageSidebar";
import { WelcomePageTilesContainer } from "./WelcomePageTilesContainer";
import { WelcomePageTitle } from "./WelcomePageTitle";

// TODO: Remove this test component after review
const NotificationTest = () => {
  const notify = useNotifier();
  const intl = useIntl();

  const sampleMessages = [
    { id: "1", defaultMessage: "Product updated" },
    { id: "2", defaultMessage: "Order cancelled" },
    { id: "3", defaultMessage: "Shipping zone created" },
    { id: "4", defaultMessage: "Password changed" },
    { id: "5", defaultMessage: "Avatar updated" },
    { id: "6", defaultMessage: "Categories deleted" },
    { id: "7", defaultMessage: "Translation saved" },
    { id: "8", defaultMessage: "Discount updated" },
    { id: "9", defaultMessage: "Rule created" },
    { id: "10", defaultMessage: "Voucher updated" },
  ];

  const showRandomNotifications = () => {
    // Show 3 random notifications with 500ms delay between each
    const shuffled = [...sampleMessages].sort(() => Math.random() - 0.5).slice(0, 3);

    shuffled.forEach((msg, index) => {
      setTimeout(() => {
        notify({
          status: "success",
          text: intl.formatMessage(msg),
        });
      }, index * 800);
    });
  };

  return (
    <Box marginBottom={4}>
      <Button variant="secondary" onClick={showRandomNotifications}>
        Test Notifications (click to show 3 samples)
      </Button>
    </Box>
  );
};

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
        <NotificationTest />
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
