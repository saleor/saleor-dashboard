import Skeleton from "@dashboard/components/Skeleton";
import { Box, BoxProps, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

import messages from "./messages";

type AboutCardProps = {
  aboutApp: string | null;
  loading: boolean;
} & BoxProps;

export const AboutCard: React.FC<AboutCardProps> = ({
  aboutApp,
  loading,
  ...boxProps
}) => {
  const intl = useIntl();

  const renderContent = () => {
    if (loading) {
      return <Skeleton />;
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
      <Text variant={"heading"} as={"h2"} marginBottom={4}>
        {intl.formatMessage(messages.aboutAppTitle)}
      </Text>
      <Box>{renderContent()}</Box>
    </Box>
  );
};
