import { Box, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage } from "react-intl";

interface HomeAnalyticsCardProps {
  testId?: string;
  title: string;
  children?: React.ReactNode;
}

const HomeAnalyticsCard: React.FC<HomeAnalyticsCardProps> = props => {
  const { children, title, testId } = props;

  return (
    <Box
      borderWidth={1}
      borderStyle="solid"
      borderColor="neutralPlain"
      borderRadius={3}
      padding={5}
      display="flex"
      justifyContent="space-between"
      data-test-id={testId}
    >
      <Box display="flex" flexDirection="column" gap={0.5}>
        <Text size="large" variant="body">
          {title}
        </Text>
        <Text size="medium" variant="caption" color="iconNeutralPlain">
          <FormattedMessage id="zWgbGg" defaultMessage="Today" />
        </Text>
      </Box>
      <Text as="h4" variant="heading">
        {children}
      </Text>
    </Box>
  );
};
HomeAnalyticsCard.displayName = "HomeAnalyticsCard";
export default HomeAnalyticsCard;
