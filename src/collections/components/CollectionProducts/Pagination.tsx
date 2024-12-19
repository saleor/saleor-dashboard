import { usePaginatorContext } from "@dashboard/hooks/usePaginator";
import { Box, Button, ChevronLeftIcon, ChevronRightIcon } from "@saleor/macaw-ui-next";
import React from "react";

export const Pagination = () => {
  const { hasNextPage, hasPreviousPage, loadNextPage, loadPreviousPage } = usePaginatorContext();

  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="center"
      gap={2}
      width="100%"
      paddingX={6}
    >
      <Button
        variant="secondary"
        disabled={!hasPreviousPage}
        onClick={loadPreviousPage}
        icon={<ChevronLeftIcon />}
      />
      <Button
        variant="secondary"
        disabled={!hasNextPage}
        onClick={loadNextPage}
        icon={<ChevronRightIcon />}
      />
    </Box>
  );
};
