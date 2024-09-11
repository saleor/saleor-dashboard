import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { DashboardCard } from "../Card";
import { getMetadataTitle } from "./utils";

export const MetadataLoadingCard: React.FC<{ isPrivate?: boolean }> = ({ isPrivate = false }) => {
  const intl = useIntl();

  return (
    <DashboardCard paddingTop={6}>
      <DashboardCard.Content display="flex" flexDirection="column" gap={4}>
        <Text size={5} fontWeight="bold">
          {intl.formatMessage(getMetadataTitle(isPrivate))}
        </Text>

        <Box display="flex" flexDirection="row" gap={20}>
          <Skeleton height={6} />
          <Skeleton height={6} />
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
