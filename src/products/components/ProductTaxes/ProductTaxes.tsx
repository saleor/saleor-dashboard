import { DashboardCard } from "@dashboard/components/Card";
import { TaxClassBaseFragment } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { sectionNames } from "@dashboard/intl";
import { taxesMessages } from "@dashboard/taxes/messages";
import { FetchMoreProps } from "@dashboard/types";
import { Box, DynamicCombobox } from "@saleor/macaw-ui-next";
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
          {/* Maybe this should normal Combobox, not Dynamic? */}
          <DynamicCombobox
            disabled={disabled}
            options={taxClasses.map(choice => ({
              label: choice.name,
              value: choice.id,
            }))}
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
            onChange={v =>
              onChange({
                /**
                 * Fake change event
                 * 1. Upper handlers rely on event, not values
                 * 2. Macaw's select doesn't expose inner event
                 *
                 * TODO: Expose native events from Macaw for interoperability
                 */
                target: {
                  value: v?.value ?? "",
                  name: "taxClassId",
                },
              })
            }
            onScrollEnd={() => {
              if (onFetchMore.hasMore) {
                onFetchMore.onFetchMore();
              }
            }}
            loading={onFetchMore.loading}
          />
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ProductTaxes.displayName = "ProductTaxes";
