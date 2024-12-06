import { Box, Divider, Skeleton } from "@saleor/macaw-ui-next";

export const LoadingFiltersArea = () => (
  <Box
    padding={3}
    backgroundColor="default1Hovered"
    borderBottomLeftRadius={2}
    borderBottomRightRadius={2}
    display="flex"
    flexDirection="column"
  >
    <Box display="flex" flexDirection="column" gap={3} height="100%">
      <Skeleton height={7} />
      <Skeleton height={7} />
      <Skeleton height={7} />
    </Box>
    <Divider />
    <Box display="flex" gap={4} justifyContent="space-between">
      <Skeleton height={7} __width="60px" />
      <Box display="flex" gap={3}>
        <Skeleton height={7} __width="60px" />
        <Skeleton height={7} __width="60px" />
      </Box>
    </Box>
  </Box>
);
