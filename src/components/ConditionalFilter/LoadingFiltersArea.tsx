import { Box, Divider, Skeleton } from "@saleor/macaw-ui-next";

import { type ConditionalFiltersLayout } from "./UI";

interface LoadingFiltersAreaProps {
  layout?: ConditionalFiltersLayout;
}

export const LoadingFiltersArea = ({ layout = "popover" }: LoadingFiltersAreaProps) => {
  const isInline = layout === "inline";

  return (
    <Box
      padding={isInline ? undefined : 3}
      backgroundColor={isInline ? undefined : "default1Hovered"}
      borderBottomLeftRadius={isInline ? undefined : 2}
      borderBottomRightRadius={isInline ? undefined : 2}
      display="flex"
      flexDirection="column"
      gap={isInline ? 3 : undefined}
    >
      <Box display="flex" flexDirection="column" gap={isInline ? undefined : 3} height="100%">
        <Skeleton height={7} />
        <Skeleton height={7} />
        <Skeleton height={7} />
      </Box>
      {!isInline ? <Divider /> : null}
      <Box display="flex" gap={4} justifyContent="space-between" flexWrap="wrap">
        <Skeleton height={7} __width="60px" />
        <Box display="flex" gap={3}>
          <Skeleton height={7} __width="60px" />
          <Skeleton height={7} __width="60px" />
        </Box>
      </Box>
    </Box>
  );
};
