import { DashboardCard } from "@dashboard/components/Card";
import { Combobox } from "@dashboard/components/Combobox";
import { TaxClassBaseFragment } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { sectionNames } from "@dashboard/intl";
import { taxesMessages } from "@dashboard/taxes/messages";
import { FetchMoreProps } from "@dashboard/types";
import { makeStyles } from "@saleor/macaw-ui";
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

const useStyles = makeStyles(
  {
    root: {
      overflow: "visible",
    },
  },
  { name: "ProductTypeTaxes" },
);
const ProductTypeTaxes = (props: ProductTypeTaxesProps) => {
  const { data, disabled, taxClasses, taxClassDisplayName, onChange, onFetchMore } = props;
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
            value: data.taxClassId,
          }}
          onChange={onChange}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ProductTypeTaxes.displayName = "ProductTypeTaxes";
export default ProductTypeTaxes;
