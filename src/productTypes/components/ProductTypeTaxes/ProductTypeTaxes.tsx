import { DashboardCard } from "@dashboard/components/Card";
import { type TaxClassBaseFragment } from "@dashboard/graphql";
import { type ChangeEvent } from "@dashboard/hooks/useForm";
import { sectionNames } from "@dashboard/intl";
import { TaxClassCombobox } from "@dashboard/taxes/components/TaxClassCombobox/TaxClassCombobox";
import { type FetchMoreProps } from "@dashboard/types";
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

export const ProductTypeTaxes = (props: ProductTypeTaxesProps) => {
  const { data, disabled, taxClasses, taxClassDisplayName, onChange, onFetchMore } = props;
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(sectionNames.taxes)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <TaxClassCombobox
          value={data.taxClassId}
          displayName={taxClassDisplayName}
          taxClasses={taxClasses}
          disabled={disabled}
          onChange={onChange}
          onFetchMore={onFetchMore}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ProductTypeTaxes.displayName = "ProductTypeTaxes";
