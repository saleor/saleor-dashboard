import { useCloud } from "@dashboard/auth/hooks/useCloud";
import { EnvironmentSwitcher } from "@dashboard/cloud-extensions";
import { errorTracker } from "@dashboard/services/errorTracking";
import { Avatar, Box, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { type SidebarContentVariant } from "./Content";
import styles from "./MountingPoint.module.css";
import {
  SidebarCollapseButton,
  SidebarDrawerOpenButton,
  SidebarExpandButton,
} from "./SidebarCollapseToggle";
import { useSidebarLogo } from "./useSidebarLogo";

interface MountingPointProps {
  variant: SidebarContentVariant;
  collapsed: boolean;
}

export const MountingPoint = ({ variant, collapsed }: MountingPointProps) => {
  const logo = useSidebarLogo();
  const { isCloudInstance, isAuthenticatedViaCloud } = useCloud();

  if (collapsed) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" className={styles.header}>
        {variant === "rail" ? (
          <SidebarDrawerOpenButton logo={logo} />
        ) : (
          <SidebarExpandButton logo={logo} />
        )}
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      gap={3}
      alignItems="center"
      className={clsx(styles.header, styles.expandedHeader)}
    >
      <Avatar.Store src={logo} scheme="accent1" size="small" />
      <Text size={3} fontWeight="bold" __flex="1" className="ellipsis">
        Saleor Dashboard
      </Text>
      {isCloudInstance && isAuthenticatedViaCloud && (
        <ErrorBoundary fallbackRender={() => null} onError={errorTracker.captureException}>
          <Suspense fallback={null}>
            <EnvironmentSwitcher />
          </Suspense>
        </ErrorBoundary>
      )}
      {variant === "collapsible" && <SidebarCollapseButton />}
    </Box>
  );
};
