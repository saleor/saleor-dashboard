import { DashboardCard } from "@dashboard/components/Card";
import { TaxClassBaseFragment } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { sectionNames } from "@dashboard/intl";
import { taxesMessages } from "@dashboard/taxes/messages";
import { FetchMoreProps } from "@dashboard/types";
import { DynamicCombobox } from "@saleor/macaw-ui-next";
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
        <DynamicCombobox
          autoComplete="off"
          disabled={disabled}
          label={intl.formatMessage(taxesMessages.taxClass)}
          options={taxClasses.map(choice => ({
            label: choice.name,
            value: choice.id,
          }))}
          onScrollEnd={() => {
            if (onFetchMore.hasMore) {
              onFetchMore.onFetchMore();
            }
          }}
          name="taxClassId"
          value={{
            label: taxClassDisplayName,
            value: data.taxClassId,
          }}
          onChange={v =>
            onChange({
              target: {
                name: "taxClassId",
                value: v?.value ?? "",
              },
            })
          }
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ProductTypeTaxes.displayName = "ProductTypeTaxes";
