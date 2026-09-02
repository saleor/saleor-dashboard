import { Box, Divider, Skeleton } from "@saleor/macaw-ui-next";

import styles from "./LoadingFiltersArea.module.css";
import { type ConditionalFiltersLayout } from "./UI";

interface LoadingFiltersAreaProps {
  layout?: ConditionalFiltersLayout;
}

export const LoadingFiltersArea = ({
  layout = "popover",
}: LoadingFiltersAreaProps): JSX.Element => {
  const isPopover = layout === "popover";
  const isPanel = layout === "panel";

  return (
    <Box
      padding={isPopover ? 3 : undefined}
      backgroundColor={isPopover ? "default1Hovered" : undefined}
      borderBottomLeftRadius={isPopover ? 2 : undefined}
      borderBottomRightRadius={isPopover ? 2 : undefined}
      display="flex"
      flexDirection="column"
      gap={isPopover ? undefined : 3}
      width="100%"
      __minWidth="0"
    >
      <Box
        display="flex"
        flexDirection="column"
        gap={3}
        height="100%"
        padding={isPanel ? 4 : undefined}
      >
        <Skeleton height={7} />
        <Skeleton height={7} />
        <Skeleton height={7} />
      </Box>
      {isPopover ? <Divider /> : null}
      <Box
        className={isPanel ? styles.panelFooter : undefined}
        display="flex"
        gap={isPanel ? undefined : 4}
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <Skeleton height={7} __width="60px" />
        <Box display="flex" gap={3}>
          <Skeleton height={7} __width="60px" />
          {isPanel ? <Skeleton height={7} __width="60px" /> : null}
          <Skeleton height={7} __width="60px" />
        </Box>
      </Box>
    </Box>
  );
};
