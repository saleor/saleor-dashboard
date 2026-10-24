import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { DetailPageContent } from "@dashboard/components/DetailPageContent/DetailPageContent";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { DetailPageLayout } from "@dashboard/components/Layouts/Detail";
import { Savebar } from "@dashboard/components/Savebar";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { buttonMessages } from "@dashboard/intl";
import { messages } from "@dashboard/warehouses/messages";
import { warehouseListPath } from "@dashboard/warehouses/urls";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { WarehouseShippingZonesCard } from "../WarehouseShippingZonesCard/WarehouseShippingZonesCard";

const noop = (): void => undefined;

const InputSkeleton = (): ReactNode => <Skeleton __height="3rem" />;

interface WarehouseDetailsPageLoadingProps {
  /** Channels load on their own, so the real card shows its own loading state. */
  channelsCard: ReactNode;
  /** Set when the warehouse failed to load: shows the error and a retry instead of skeletons. */
  onRetry?: () => void;
}

/**
 * Layout-shaped shell while the warehouse loads. The form mounts only once the warehouse
 * exists, so pickup and address never show defaults that flip when the data arrives.
 */
export const WarehouseDetailsPageLoading = ({
  channelsCard,
  onRetry,
}: WarehouseDetailsPageLoadingProps): ReactNode => {
  const intl = useIntl();
  const warehouseListBackLink = useBackLinkWithState({ path: warehouseListPath });

  return (
    <DetailPageLayout>
      <TopNav
        href={warehouseListBackLink}
        hrefIcon={<TopNavDestinationIcon.warehouses />}
        hrefTitle={intl.formatMessage(topNavDestinationMessages.allWarehouses)}
        title={onRetry ? null : <Skeleton __width="12rem" __height="1.5rem" />}
      />
      <DetailPageLayout.Content>
        {onRetry ? (
          <DetailPageContent data-test-id="warehouse-details-load-error">
            <Box display="flex" flexDirection="column" alignItems="flex-start" gap={3}>
              <Text size={4}>
                <FormattedMessage {...messages.loadError} />
              </Text>
              <Button variant="secondary" type="button" onClick={onRetry}>
                <FormattedMessage {...buttonMessages.retry} />
              </Button>
            </Box>
          </DetailPageContent>
        ) : (
          <DetailPageContent aria-busy="true" data-test-id="warehouse-details-loading">
            <DetailSettingsCard title={<FormattedMessage {...messages.general} />}>
              <Box display="flex" flexDirection="column" gap={4}>
                <InputSkeleton />
                <InputSkeleton />
              </Box>
            </DetailSettingsCard>
            <DetailSettingsCard title={<FormattedMessage {...messages.address} />}>
              <Box display="flex" flexDirection="column" gap={4}>
                <InputSkeleton />
                <InputSkeleton />
                <InputSkeleton />
                <InputSkeleton />
              </Box>
            </DetailSettingsCard>
            <DetailSettingsCard title={<FormattedMessage {...messages.pickupTitle} />}>
              <InputSkeleton />
            </DetailSettingsCard>
          </DetailPageContent>
        )}
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar paddingTop={6}>
        <Box display="flex" flexDirection="column" gap={4}>
          {channelsCard}
          <WarehouseShippingZonesCard
            legacyStockAvailability={undefined}
            zones={[]}
            totalCount={null}
            loading
            membershipStatus="loading"
            warehouseChannelIds={[]}
            channelNames={[]}
            pickupEnabled={false}
            canManage={false}
            onRequestAssign={noop}
            onRemove={noop}
          />
        </Box>
      </DetailPageLayout.RightSidebar>
      <Savebar>
        <Savebar.Spacer />
        <Savebar.CancelButton onClick={noop} disabled />
        <Savebar.ConfirmButton transitionState="default" disabled type="button" />
      </Savebar>
    </DetailPageLayout>
  );
};
