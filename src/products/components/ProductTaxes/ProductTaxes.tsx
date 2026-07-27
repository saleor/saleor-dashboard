import { DashboardCard } from "@dashboard/components/Card";
import { type TaxClassBaseFragment } from "@dashboard/graphql";
import { type ChangeEvent } from "@dashboard/hooks/useForm";
import { sectionNames } from "@dashboard/intl";
import { TaxClassCombobox } from "@dashboard/taxes/components/TaxClassCombobox/TaxClassCombobox";
import { taxesMessages } from "@dashboard/taxes/messages";
import { type FetchMoreProps } from "@dashboard/types";
import { Box } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

interface ProductTaxesProps {
  value: string;
  taxClassDisplayName: string;
  taxClasses: TaxClassBaseFragment[];
  disabled: boolean;
  onChange: (event: ChangeEvent) => void;
  onFetchMore: FetchMoreProps;
}

export const ProductTaxes = (props: ProductTaxesProps) => {
  const { value, disabled, taxClasses, taxClassDisplayName, onChange, onFetchMore } = props;
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(sectionNames.taxes)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Box data-test-id="taxes">
          <TaxClassCombobox
            value={value}
            displayName={taxClassDisplayName}
            taxClasses={taxClasses}
            disabled={disabled}
            emptyOptionMessage={taxesMessages.taxClassProductTypeDefault}
            onChange={onChange}
            onFetchMore={onFetchMore}
          />
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ProductTaxes.displayName = "ProductTaxes";
