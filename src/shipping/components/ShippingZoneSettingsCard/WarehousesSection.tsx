import { DashboardCard } from "@dashboard/components/Card";
import CardSpacer from "@dashboard/components/CardSpacer";
import { Multiselect } from "@dashboard/components/Combobox/components/Multiselect";
import { MicrocopyLink } from "@dashboard/components/MicrocopyLink";
import { type FormChange } from "@dashboard/hooks/useForm";
import { type WarehouseChoice } from "@dashboard/shipping/warehouseEligibility";
import { type FetchMoreProps, type SearchProps } from "@dashboard/types";
import { warehouseUrl } from "@dashboard/warehouses/urls";
import { Box, Button, type Option, Skeleton, Text } from "@saleor/macaw-ui-next";
import { type ReactElement } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

const messages = defineMessages({
  directSubtitle: {
    id: "N/hLIR",
    defaultMessage:
      "Linking locations doesn't change which stock is available in your store. Apps can read it.",
    description: "shipping zone warehouses in the default stock mode",
  },
  legacySubtitle: {
    id: "INSpAx",
    defaultMessage: "Stock in these locations can be bought by customers in this zone's countries.",
    description: "shipping zone warehouses in the older stock mode",
  },
  collapsed: {
    id: "0kqLrq",
    defaultMessage: "Linking a location doesn't change which stock is available.",
    description: "shipping zone warehouses collapsed in the default stock mode",
  },
  addLocation: {
    id: "lXiks/",
    defaultMessage: "Add a location",
    description: "shipping zone warehouses expand control",
  },
  selectFieldLabel: {
    id: "PV0SQd",
    defaultMessage: "Warehouse",
    description: "WarehousesSection select field label",
  },
  ineligibleIntro: {
    id: "1CXcI7",
    defaultMessage: "These locations aren't in this zone's channels, so they can't be linked yet.",
    description: "shipping zone warehouses that share no channel",
  },
  notInChannels: {
    id: "Arrv6m",
    defaultMessage: "Not in {channels}",
    description: "shipping zone warehouse missing the zone's channels",
  },
  addChannelFirst: {
    id: "WrQB8Z",
    defaultMessage: "Add a channel above first.",
    description: "shipping zone warehouse when the zone has no channel",
  },
  openChannels: {
    id: "0AVqMM",
    defaultMessage: "Channels",
    description: "link to the warehouse channels card",
  },
});

interface WarehousesSectionProps extends FetchMoreProps, SearchProps {
  choices: Option[];
  onChange: FormChange;
  selectedWarehouses: Option[];
  /** Undefined while the shop stock mode is still loading. */
  legacyStockAvailability: boolean | undefined;
  ineligibleWarehouses: WarehouseChoice[];
  zoneChannelNames: string[];
  expanded: boolean;
  onExpand: () => void;
}

const WarehousesSection = ({
  onSearchChange,
  onChange,
  onFetchMore,
  choices,
  selectedWarehouses,
  hasMore,
  loading,
  legacyStockAvailability,
  ineligibleWarehouses,
  zoneChannelNames,
  expanded,
  onExpand,
}: WarehousesSectionProps): ReactElement => {
  const intl = useIntl();
  const channelNames =
    zoneChannelNames.length === 0
      ? ""
      : zoneChannelNames.length <= 2
        ? zoneChannelNames.join(", ")
        : `${zoneChannelNames[0]} +${zoneChannelNames.length - 1}`;

  if (legacyStockAvailability === undefined) {
    return <Skeleton __height="2.5rem" __width="100%" />;
  }

  if (!legacyStockAvailability && selectedWarehouses.length === 0 && !expanded) {
    return (
      <Box display="flex" flexDirection="column" gap={2}>
        <DashboardCard.Subtitle fontSize={3} color="default2">
          <FormattedMessage {...messages.collapsed} />
        </DashboardCard.Subtitle>
        <Box>
          <Button variant="secondary" type="button" size="small" onClick={onExpand}>
            <FormattedMessage {...messages.addLocation} />
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <DashboardCard.Subtitle fontSize={3} color="default2">
        <FormattedMessage
          {...(legacyStockAvailability ? messages.legacySubtitle : messages.directSubtitle)}
        />
      </DashboardCard.Subtitle>
      <CardSpacer />

      <Multiselect
        label={intl.formatMessage(messages.selectFieldLabel)}
        data-test-id="select-warehouse-for-shipping-method"
        name="warehouses"
        options={choices}
        value={selectedWarehouses}
        onChange={onChange}
        fetchOptions={onSearchChange}
        fetchMore={{
          onFetchMore,
          hasMore,
          loading,
        }}
      />

      {ineligibleWarehouses.length > 0 ? (
        <Box display="flex" flexDirection="column" gap={2} marginTop={4}>
          <DashboardCard.Subtitle fontSize={3} color="default2">
            <FormattedMessage {...messages.ineligibleIntro} />
          </DashboardCard.Subtitle>
          {ineligibleWarehouses.map(warehouse => (
            <Box
              key={warehouse.id}
              display="flex"
              flexWrap="wrap"
              alignItems="baseline"
              gap={2}
              data-test-id="shipping-zone-ineligible-warehouse"
            >
              <Text size={3}>{warehouse.name}</Text>
              <Text size={2} color="default2">
                {channelNames ? (
                  <FormattedMessage
                    {...messages.notInChannels}
                    values={{ channels: channelNames }}
                  />
                ) : (
                  <FormattedMessage {...messages.addChannelFirst} />
                )}
              </Text>
              <MicrocopyLink to={`${warehouseUrl(warehouse.id)}#warehouse-channels`}>
                <FormattedMessage {...messages.openChannels} />
              </MicrocopyLink>
            </Box>
          ))}
        </Box>
      ) : null}
    </>
  );
};

export default WarehousesSection;
