import { Title2 } from "@dashboard/components/Title2/Title2";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { DashboardCard } from "../Card";
import { type MetadataCardProps } from "./MetadataCard";
import { getMetadataTitle } from "./utils";

export const MetadataLoadingCard = ({
  isPrivate = false,
  inModal = false,
  marginTop = 4,
}: Pick<MetadataCardProps, "inModal" | "marginTop"> & { isPrivate?: boolean }) => {
  const intl = useIntl();

  if (inModal) {
    return (
      <Box marginTop={marginTop} data-test-id="metadata-editor" data-test-is-private={isPrivate}>
        <Box
          backgroundColor="default2"
          borderRadius={4}
          borderStyle="solid"
          borderColor="default1"
          borderWidth={1}
          paddingY={4}
          paddingX={5}
          display="flex"
          flexDirection="column"
          gap={4}
        >
          <Title2>{intl.formatMessage(getMetadataTitle(isPrivate))}</Title2>
          <Skeleton height={6} data-test-id="skeleton" />
        </Box>
      </Box>
    );
  }

  return (
    <DashboardCard paddingTop={6}>
      <DashboardCard.Content display="flex" flexDirection="column" gap={4} paddingX={6}>
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
