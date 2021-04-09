import CardSpacer from "@saleor/components/CardSpacer";
import MultiAutocompleteSelectField, {
  MultiAutocompleteChoiceType
} from "@saleor/components/MultiAutocompleteSelectField";
import { FormChange } from "@saleor/hooks/useForm";
import { FetchMoreProps, SearchProps } from "@saleor/types";
import React from "react";
import { useIntl } from "react-intl";
import { defineMessages, FormattedMessage } from "react-intl";

const messages = defineMessages({
  subtitle: {
    defaultMessage:
      "Select warehouse from which you will ship products for this shipping zone. This warehouse address will also be used to calculate taxes.",
    description: "WarehousesSection subtitle"
  },
  selectFieldAddText: {
    defaultMessage: "Add New Warehouse",
    description: "WarehousesSection select field add text"
  },
  selectFieldLabel: {
    defaultMessage: "Warehouse",
    description: "WarehousesSection select field label",
    id: "shippingZoneWarehouses.autocomplete.label"
  },
  selectFieldPlaceholder: {
    defaultMessage: "Select Warehouse",
    description: "WarehousesSection select field placeholder"
  }
});

interface WarehousesSectionProps extends FetchMoreProps, SearchProps {
  displayValues: MultiAutocompleteChoiceType[];
  choices: MultiAutocompleteChoiceType[];
  onChange: FormChange;
  onAdd: () => void;
  selectedWarehouses: string[];
}

const WarehousesSection: React.FC<WarehousesSectionProps> = ({
  onAdd,
  onSearchChange,
  onChange,
  onFetchMore,
  displayValues,
  choices,
  selectedWarehouses,
  hasMore,
  loading
}) => {
  const intl = useIntl();

  return (
    <>
      <FormattedMessage {...messages.subtitle} />
      <CardSpacer />
      <MultiAutocompleteSelectField
        add={{
          label: intl.formatMessage(messages.selectFieldAddText),
          onClick: onAdd
        }}
        choices={choices}
        displayValues={displayValues}
        fetchChoices={onSearchChange}
        hasMore={hasMore}
        label={intl.formatMessage(messages.selectFieldLabel)}
        loading={loading}
        name="warehouses"
        onChange={onChange}
        onFetchMore={onFetchMore}
        placeholder={intl.formatMessage(messages.selectFieldPlaceholder)}
        value={selectedWarehouses}
      />
    </>
  );
};

export default WarehousesSection;
