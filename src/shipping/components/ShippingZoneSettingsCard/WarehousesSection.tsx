import CardSpacer from "@dashboard/components/CardSpacer";
import { Multiselect } from "@dashboard/components/Combobox";
import { FormChange } from "@dashboard/hooks/useForm";
import { FetchMoreProps, SearchProps } from "@dashboard/types";
import { Box, Button, Option } from "@saleor/macaw-ui-next";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

const messages = defineMessages({
  subtitle: {
    id: "wjKYSU",
    defaultMessage:
      "Select warehouse from which you will ship products for this shipping zone. This warehouse address will also be used to calculate taxes.",
    description: "WarehousesSection subtitle",
  },
  selectFieldAddText: {
    id: "n25d+d",
    defaultMessage: "Add New Warehouse",
    description: "WarehousesSection select field add text",
  },
  selectFieldLabel: {
    id: "PV0SQd",
    defaultMessage: "Warehouse",
    description: "WarehousesSection select field label",
  },
  selectFieldPlaceholder: {
    id: "/cow4T",
    defaultMessage: "Select Warehouse",
    description: "WarehousesSection select field placeholder",
  },
});

interface WarehousesSectionProps extends FetchMoreProps, SearchProps {
  choices: Option[];
  onChange: FormChange;
  onAdd: () => void;
  selectedWarehouses: Option[];
}

const WarehousesSection = ({
  onAdd,
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
      <FormattedMessage {...messages.subtitle} />
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

      <Box marginTop={4} display="flex" justifyContent="flex-end">
        <Button variant="secondary" onClick={onAdd}>
          {intl.formatMessage(messages.selectFieldAddText)}
        </Button>
      </Box>
    </>
  );
};

export default WarehousesSection;
