import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

interface HomeAnalyticsCardProps {
  testId?: string;
  title: string;
  children?: React.ReactNode;
}

export const HomeAnalyticsCard = ({
  children,
  title,
  testId,
}: HomeAnalyticsCardProps) => (
  <Box
    borderWidth={1}
    borderStyle="solid"
    borderColor="default1"
    borderRadius={3}
    paddingX={3}
    paddingY={5}
    display="flex"
    justifyContent="space-between"
    data-test-id={testId}
  >
    <Box display="flex" flexDirection="column" gap={0.5}>
      <Text size="large" variant="body">
        {title}
      </Text>
      <Text size="medium" variant="caption" color="default1">
        <FormattedMessage id="zWgbGg" defaultMessage="Today" />
      </Text>
    </Box>
    <Text as="h4" typeSize={5} fontWeight="bold">
      {children}
    </Text>
  </Box>
);
