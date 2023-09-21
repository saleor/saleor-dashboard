import { DashboardCard } from "@dashboard/components/Card";
import { Combobox } from "@dashboard/components/Combobox";
import { TaxClassBaseFragment } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { sectionNames } from "@dashboard/intl";
import { taxesMessages } from "@dashboard/taxes/messages";
import { FetchMoreProps } from "@dashboard/types";
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
    onFetchMore,
  } = props;
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Title>
        {intl.formatMessage(sectionNames.taxes)}
      </DashboardCard.Title>
      <DashboardCard.Content>
        <Combobox
          disabled={disabled}
          options={taxClasses.map(choice => ({
            label: choice.name,
            value: choice.id,
          }))}
          fetchOptions={() => {}}
          value={
            value
              ? {
                  value,
                  label: taxClassDisplayName,
                }
              : null
          }
          name="taxClassId"
          label={intl.formatMessage(taxesMessages.taxClass)}
          onChange={onChange}
          fetchMore={onFetchMore}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};
ProductTaxes.displayName = "ProductTaxes";
export default ProductTaxes;
