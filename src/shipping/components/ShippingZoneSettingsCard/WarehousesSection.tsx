import { DashboardCard } from "@dashboard/components/Card";
import CardSpacer from "@dashboard/components/CardSpacer";
import { Multiselect } from "@dashboard/components/Combobox/components/Multiselect";
import { type FormChange } from "@dashboard/hooks/useForm";
import { type WarehouseChoice } from "@dashboard/shipping/warehouseEligibility";
import { type FetchMoreProps, type SearchProps } from "@dashboard/types";
import { warehouseUrl } from "@dashboard/warehouses/urls";
import { Box, Button, type Option, Skeleton, Text } from "@saleor/macaw-ui-next";
import { type ReactElement } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

const messages = defineMessages({
  directSubtitle: {
    id: "T8FKZK",
    defaultMessage:
      "Linking warehouses doesn't change which stock is available in your store. Apps can read it.",
    description: "shipping zone warehouses in the default stock mode",
  },
  legacySubtitle: {
    id: "XnUWjR",
    defaultMessage:
      "Stock in these warehouses can be bought by customers in this zone's countries.",
    description: "shipping zone warehouses in the older stock mode",
  },
  collapsed: {
    id: "JW+A2b",
    defaultMessage: "Linking a warehouse doesn't change which stock is available.",
    description: "shipping zone warehouses collapsed in the default stock mode",
  },
  addLocation: {
    id: "RBCyrU",
    defaultMessage: "Add a warehouse",
    description: "shipping zone warehouses expand control",
  },
  selectFieldLabel: {
    id: "PV0SQd",
    defaultMessage: "Warehouse",
    description: "WarehousesSection select field label",
  },
  ineligibleIntro: {
    id: "88iCr+",
    defaultMessage: "These warehouses aren't in this zone's channels, so they can't be linked yet.",
    description: "shipping zone warehouses that share no channel",
  },
  addChannelFirst: {
    id: "WrQB8Z",
    defaultMessage: "Add a channel above first.",
    description: "shipping zone warehouse when the zone has no channel",
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
        <Box display="flex" flexDirection="column" gap={3} marginTop={4}>
          <DashboardCard.Subtitle fontSize={3} color="default2">
            <FormattedMessage
              {...(channelNames ? messages.ineligibleIntro : messages.addChannelFirst)}
            />
          </DashboardCard.Subtitle>
          {channelNames
            ? ineligibleWarehouses.map(warehouse => (
                <Link
                  key={warehouse.id}
                  to={`${warehouseUrl(warehouse.id)}#warehouse-channels`}
                  style={{ textDecoration: "none" }}
                  data-test-id="shipping-zone-ineligible-warehouse"
                >
                  <Text
                    as="span"
                    size={3}
                    fontWeight="medium"
                    color="default1"
                    textDecoration={{ hover: "underline" }}
                  >
                    {warehouse.name}
                  </Text>
                </Link>
              ))
            : null}
        </Box>
      ) : null}
    </>
  );
};

export default WarehousesSection;
