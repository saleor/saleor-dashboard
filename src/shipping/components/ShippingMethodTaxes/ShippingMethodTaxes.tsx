import { DashboardCard } from "@dashboard/components/Card";
import { Combobox } from "@dashboard/components/Combobox";
import { TaxClassBaseFragment } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { sectionNames } from "@dashboard/intl";
import { taxesMessages } from "@dashboard/taxes/messages";
import { FetchMoreProps } from "@dashboard/types";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

interface ShippingMethodTaxesProps {
  value: string;
  taxClassDisplayName: string;
  taxClasses: TaxClassBaseFragment[];
  disabled: boolean;
  onChange: (event: ChangeEvent) => void;
  onFetchMore: FetchMoreProps;
}

const useStyles = makeStyles(
  {
    root: {
      overflow: "visible",
    },
  },
  { name: "ShippingMethodTaxes" },
);
const ShippingMethodTaxes = (props: ShippingMethodTaxesProps) => {
  const { value, disabled, taxClasses, taxClassDisplayName, onChange, onFetchMore } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <DashboardCard className={classes.root}>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(sectionNames.taxes)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Combobox
          allowEmptyValue
          autoComplete="off"
          data-test-id="taxes"
          disabled={disabled}
          label={intl.formatMessage(taxesMessages.taxClass)}
          options={taxClasses.map(choice => ({
            label: choice.name,
            value: choice.id,
          }))}
          fetchOptions={() => undefined}
          fetchMore={onFetchMore}
          name="taxClassId"
          value={{
            label: taxClassDisplayName,
            value,
          }}
          onChange={onChange}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ShippingMethodTaxes.displayName = "ShippingMethodTaxes";
export default ShippingMethodTaxes;
