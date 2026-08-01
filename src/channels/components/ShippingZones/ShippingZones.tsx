import { type ChannelShippingZones } from "@dashboard/channels/pages/ChannelDetailsPage/types";
import { DashboardCard } from "@dashboard/components/Card";
import { type SearchShippingZonesQuery } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { shippingZoneUrl } from "@dashboard/shipping/urls";
import { type FetchMoreProps, type RelayToFlat } from "@dashboard/types";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { AssignmentList } from "../AssignmentList/AssignmentList";
import { messages } from "./messages";

interface ShippingZonesProps {
  addShippingZone: (id: string) => void;
  removeShippingZone: (id: string) => void;
  searchShippingZones: (searchPhrase: string) => void;
  loading: boolean;
  totalCount: number;
  fetchMoreShippingZones: FetchMoreProps;
  shippingZones: ChannelShippingZones;
  shippingZonesChoices: RelayToFlat<SearchShippingZonesQuery["search"]>;
  onCreateShipping?: () => void;
}

export const ShippingZones = (props: ShippingZonesProps) => {
  const {
    addShippingZone,
    removeShippingZone,
    searchShippingZones,
    loading,
    totalCount,
    fetchMoreShippingZones,
    shippingZones,
    shippingZonesChoices,
    onCreateShipping,
  } = props;
  const intl = useIntl();
  const showCreateEmptyState = !loading && totalCount === 0 && (shippingZones?.length ?? 0) === 0;

  return (
    <DashboardCard data-test-id="shipping-zones-section">
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(sectionNames.shippingZones)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Text>{intl.formatMessage(messages.subtitle)}</Text>
      </DashboardCard.Content>
      {showCreateEmptyState && onCreateShipping ? (
        <Box paddingX={6} paddingBottom={4}>
          <Button
            variant="secondary"
            data-test-id="sidebar-create-shipping"
            onClick={onCreateShipping}
          >
            <FormattedMessage
              id="1nYdfw"
              defaultMessage="Create shipping"
              description="empty shipping zones sidebar CTA"
            />
          </Button>
        </Box>
      ) : (
        <AssignmentList
          loading={loading}
          items={shippingZones!}
          itemsChoices={shippingZonesChoices!}
          addItem={addShippingZone}
          removeItem={removeShippingZone}
          searchItems={searchShippingZones}
          fetchMoreItems={fetchMoreShippingZones}
          totalCount={totalCount}
          dataTestId="shipping"
          inputName="shippingZone"
          itemsName={intl.formatMessage(sectionNames.shippingZones)}
          getItemHref={({ id }) => shippingZoneUrl(id)}
        />
      )}
    </DashboardCard>
  );
};
