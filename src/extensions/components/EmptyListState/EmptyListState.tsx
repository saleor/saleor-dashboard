import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface EmptyListStateProps {
  title: string;
  subtitle?: string;
  onSubtitleClick?: () => void;
}

export const EmptyListState = ({ title, onSubtitleClick, subtitle }: EmptyListStateProps) => (
  <Box
    display="flex"
    justifyContent="center"
    flexDirection="column"
    gap={2}
    marginY={24}
    textAlign="center"
    data-test-id="empty-search-list"
  >
    <Text size={5} fontWeight="bold" color="default1">
      {title}
    </Text>
    <Text
      onClick={onSubtitleClick}
      size={3}
      color="default1"
      cursor="pointer"
      textDecoration="underline"
      style={{ textUnderlineOffset: "4px" }}
    >
      {subtitle}
    </Text>
  </Box>
);
