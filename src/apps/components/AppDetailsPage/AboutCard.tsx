import { Box, BoxProps, Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import messages from "./messages";

type AboutCardProps = {
  aboutApp: string | null;
  loading: boolean;
} & BoxProps;

export const AboutCard: React.FC<AboutCardProps> = ({ aboutApp, loading, ...boxProps }) => {
  const intl = useIntl();
  const renderContent = () => {
    if (loading) {
      return <Skeleton data-test-id="app-page-loader" />;
    }

    if (aboutApp) {
      return <Text>{aboutApp}</Text>;
    }

    if (!aboutApp) {
      return <Text>{intl.formatMessage(messages.noAboutApp)}</Text>;
    }

    throw new Error('Leaking "if" statement, should never happen');
  };

  return (
    <Box {...boxProps}>
      <Text size={5} fontWeight="bold" as={"h2"} marginBottom={4}>
        {intl.formatMessage(messages.aboutAppTitle)}
      </Text>
      <Box>{renderContent()}</Box>
    </Box>
  );
};
