import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { DashboardCard } from "../Card";
import { type MetadataCardProps } from "./MetadataCard";
import { getMetadataTitle } from "./utils";

export const MetadataLoadingCard = ({
  isPrivate = false,
  inModal = false,
}: Pick<MetadataCardProps, "inModal"> & { isPrivate?: boolean }) => {
  const intl = useIntl();

  return (
    <DashboardCard paddingTop={inModal ? 0 : 6}>
      <DashboardCard.Content
        display="flex"
        flexDirection="column"
        gap={4}
        paddingX={inModal ? 0 : 6}
      >
        <Text size={6} fontWeight="medium">
          {intl.formatMessage(getMetadataTitle(isPrivate))}
        </Text>

        <Box display="flex" flexDirection="row" gap={20}>
          <Skeleton height={6} data-test-id="skeleton" />
          <Skeleton height={6} data-test-id="skeleton" />
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
