import { Box, Sprinkles, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface TitleProps {
  paddingX?: Sprinkles["paddingX"];
  dataTestId?: string;
  // "title" is deprecated, use "children" instead
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}

export const Title: React.FC<TitleProps> = ({
  children,
  paddingX,
  dataTestId,
  title,
  subtitle,
  className,
}) => (
  <Box paddingX={paddingX ?? 6} paddingTop={6} data-test-id={dataTestId} className={className}>
    <Text size={5} fontWeight="bold">
      {children ?? title}
    </Text>
    {subtitle && (
      <Text size={4} fontWeight="light">
        {subtitle}
      </Text>
    )}
  </Box>
);
