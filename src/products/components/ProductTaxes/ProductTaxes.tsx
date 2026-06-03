import { DashboardCard } from "@dashboard/components/Card";
import { TaxClassBaseFragment } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { commonMessages, sectionNames } from "@dashboard/intl";
import { taxesMessages } from "@dashboard/taxes/messages";
import { FetchMoreProps } from "@dashboard/types";
import { Box, DynamicCombobox, Option } from "@saleor/macaw-ui-next";
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
  const { value, disabled, taxClasses, taxClassDisplayName, onChange, onFetchMore } = props;
  const intl = useIntl();

  const options = taxClasses.map(choice => ({
    label: choice.name,
    value: choice.id,
  }));

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(sectionNames.taxes)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Box data-test-id="taxes">
          <DynamicCombobox
            disabled={disabled}
            options={options}
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
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ProductTaxes.displayName = "ProductTaxes";
export default ProductTaxes;
