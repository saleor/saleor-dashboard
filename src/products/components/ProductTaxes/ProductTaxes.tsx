import { DashboardCard } from "@dashboard/components/Card";
import { TaxClassBaseFragment } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { sectionNames } from "@dashboard/intl";
import { taxesMessages } from "@dashboard/taxes/messages";
import { FetchMoreProps } from "@dashboard/types";
import { Combobox } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

interface ProductTaxesProps {
  value: string;
  taxClassDisplayName: string;
  taxClasses: TaxClassBaseFragment[];
  disabled: boolean;
  onChange: (event: ChangeEvent) => void;
  onFetchMore: FetchMoreProps;
}

const ProductTaxes: React.FC<ProductTaxesProps> = props => {
  const {
    value,
    disabled,
    taxClasses,
    taxClassDisplayName,
    onChange,
    // TODO: use onFetchMore when combobox will handle infity scroll
    // onFetchMore,
  } = props;
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Title>
        {intl.formatMessage(sectionNames.taxes)}
      </DashboardCard.Title>
      <DashboardCard.Content>
        <Combobox
          size="small"
          data-test-id="category"
          disabled={disabled}
          options={taxClasses.map(choice => ({
            label: choice.name,
            value: choice.id,
          }))}
          value={value ? { value, label: taxClassDisplayName } : null}
          name="taxClassId"
          label={intl.formatMessage(taxesMessages.taxClass)}
          onChange={value => {
            onChange({
              target: { value: value?.value ?? null, name: "taxClassId" },
            });
          }}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};
ProductTaxes.displayName = "ProductTaxes";
export default ProductTaxes;
