import { ExternalLinkNext } from "@dashboard/components/ExternalLink";
import { Box, BoxProps, Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import messages from "./messages";

type DataPrivacyCardProps = {
  dataPrivacyUrl?: string | null;
  loading: boolean;
} & BoxProps;

export const DataPrivacyCard = ({ dataPrivacyUrl, loading, ...boxProps }: DataPrivacyCardProps) => {
  const intl = useIntl();

  if (!dataPrivacyUrl && !loading) {
    return null;
  }

  const renderContent = () => {
    if (loading) {
      return <Skeleton />;
    }

    if (dataPrivacyUrl) {
      return (
        <ExternalLinkNext href={dataPrivacyUrl} target="_blank">
          <FormattedMessage {...messages.dataPrivacyDescription} />
        </ExternalLinkNext>
      );
    }

    if (!dataPrivacyUrl) {
      return <Text>{intl.formatMessage(messages.noDataPrivacyPage)}</Text>;
    }

    throw new Error('Leaking "if" statement, should never happen');
  };

  return (
    <Box {...boxProps}>
      <Text size={5} fontWeight="bold" marginBottom={4} as={"h2"}>
        {intl.formatMessage(messages.dataPrivacyTitle)}
      </Text>
      <Box>{renderContent()}</Box>
    </Box>
  );
};
