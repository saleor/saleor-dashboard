import { DashboardCard } from "@dashboard/components/Card";
import { TaxClassBaseFragment } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { commonMessages, sectionNames } from "@dashboard/intl";
import { taxesMessages } from "@dashboard/taxes/messages";
import { FetchMoreProps } from "@dashboard/types";
import { DynamicCombobox, Option } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

interface ProductTypeTaxesProps {
  data: {
    taxClassId: string;
  };
  taxClassDisplayName: string;
  taxClasses: TaxClassBaseFragment[];
  disabled: boolean;
  onChange: (event: ChangeEvent) => void;
  onFetchMore: FetchMoreProps;
}

const ProductTypeTaxes: React.FC<ProductTypeTaxesProps> = props => {
  const { data, disabled, taxClasses, taxClassDisplayName, onChange, onFetchMore } = props;
  const intl = useIntl();

  // Add empty option for "allowEmptyValue" behavior
  const options = [
    { label: "", value: "" },
    ...taxClasses.map(choice => ({
      label: choice.name,
      value: choice.id,
    })),
  ];

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(sectionNames.taxes)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <DynamicCombobox
          autoComplete="off"
          disabled={disabled}
          label={intl.formatMessage(taxesMessages.taxClass)}
          options={options}
          name="taxClassId"
          value={
            data.taxClassId
              ? {
                  label: taxClassDisplayName,
                  value: data.taxClassId,
                }
              : null
          }
          onChange={(option: Option | null) => {
            onChange({
              target: { name: "taxClassId", value: option?.value ?? null },
            });
          }}
          onScrollEnd={() => {
            if (onFetchMore?.hasMore) {
              onFetchMore.onFetchMore();
            }
          }}
          loading={onFetchMore?.loading || onFetchMore?.hasMore}
          locale={{
            loadingText: intl.formatMessage(commonMessages.loading),
          }}
          size="small"
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ProductTypeTaxes.displayName = "ProductTypeTaxes";
export default ProductTypeTaxes;
