import sideBarDefaultLogoDarkMode from "@assets/images/sidebar-deafult-logo-darkMode.png";
import sideBarDefaultLogo from "@assets/images/sidebar-default-logo.png";
import { useCloud } from "@dashboard/auth/hooks/useCloud";
import { useLegacyThemeHandler } from "@dashboard/components/Sidebar/user/Controls";
import { errorTracker } from "@dashboard/services/errorTracking";
import { Avatar, Box, Text } from "@saleor/macaw-ui-next";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const EnvironmentSwitcher = lazy(() =>
  import("@dashboard/cloud").then(({ EnvironmentSwitcher }) => ({
    default: EnvironmentSwitcher,
  })),
);

export const MountingPoint = () => {
  const { theme } = useLegacyThemeHandler();
  const { isCloudInstance, isAuthenticatedViaCloud } = useCloud();
  const logo = theme === "defaultLight" ? sideBarDefaultLogo : sideBarDefaultLogoDarkMode;

  return (
    <Box display="flex" gap={3} alignItems="center" paddingX={4} paddingY={5}>
      <Avatar.Store src={logo} scheme="accent1" size="small" />
      <Text size={3} fontWeight="bold" __flex="1">
        Saleor Dashboard
      </Text>
      {isCloudInstance && isAuthenticatedViaCloud && (
        <ErrorBoundary fallbackRender={() => null} onError={errorTracker.captureException}>
          <Suspense fallback={null}>
            <EnvironmentSwitcher />
          </Suspense>
        </ErrorBoundary>
      )}
    </Box>
  );
};
