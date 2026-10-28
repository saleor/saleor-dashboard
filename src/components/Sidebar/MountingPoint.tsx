import { Avatar, Box, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";

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
      {variant === "collapsible" && <SidebarCollapseButton />}
    </Box>
  );
};
