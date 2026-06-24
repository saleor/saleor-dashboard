import { DashboardCard } from "@dashboard/components/Card";
import CardSpacer from "@dashboard/components/CardSpacer";
import { Multiselect } from "@dashboard/components/Combobox";
import { MicrocopyLink } from "@dashboard/components/MicrocopyLink";
import { type FormChange } from "@dashboard/hooks/useForm";
import { sectionNames } from "@dashboard/intl";
import { type FetchMoreProps, type SearchProps } from "@dashboard/types";
import { warehouseListUrl } from "@dashboard/warehouses/urls";
import { type Option } from "@saleor/macaw-ui-next";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

const messages = defineMessages({
  subtitle: {
    id: "wjKYSU",
    defaultMessage:
      "Select warehouse from which you will ship products for this shipping zone. This warehouse address will also be used to calculate taxes.",
    description: "WarehousesSection subtitle",
  },
  selectFieldLabel: {
    id: "PV0SQd",
    defaultMessage: "Warehouse",
    description: "WarehousesSection select field label",
  },
  channelRequirementHint: {
    id: "WPCbcV",
    defaultMessage: "Only warehouses that share a channel with this shipping zone can be assigned.",
    description: "WarehousesSection channel requirement hint",
  },
  createWarehouseHint: {
    id: "pC8+tL",
    defaultMessage:
      "Need a new warehouse? Create one in {link} and assign it to the same channels.",
    description: "WarehousesSection link to warehouses configuration",
  },
});

interface WarehousesSectionProps extends FetchMoreProps, SearchProps {
  choices: Option[];
  onChange: FormChange;
  selectedWarehouses: Option[];
}

const WarehousesSection = ({
  onSearchChange,
  onChange,
  onFetchMore,
  choices,
  selectedWarehouses,
  hasMore,
  loading,
}: WarehousesSectionProps) => {
  const intl = useIntl();

  return (
    <>
      <DashboardCard.Subtitle fontSize={3} color="default2">
        <FormattedMessage {...messages.subtitle} />
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

      <CardSpacer />
      <DashboardCard.Subtitle fontSize={3} color="default2">
        <FormattedMessage {...messages.channelRequirementHint} />
      </DashboardCard.Subtitle>
      <CardSpacer />
      <DashboardCard.Subtitle fontSize={3} color="default2">
        <FormattedMessage
          {...messages.createWarehouseHint}
          values={{
            link: (
              <MicrocopyLink to={warehouseListUrl()}>
                <FormattedMessage {...sectionNames.warehouses} />
              </MicrocopyLink>
            ),
          }}
        />
      </DashboardCard.Subtitle>
    </>
  );
};

export default WarehousesSection;
