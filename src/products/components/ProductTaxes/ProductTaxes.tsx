import CardTitle from "@dashboard/components/CardTitle";
import { TaxClassBaseFragment } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { taxesMessages } from "@dashboard/taxes/messages";
import { FetchMoreProps } from "@dashboard/types";
import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Combobox } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

interface ProductTaxesProps {
  value: string;
  taxClassDisplayName: string;
  taxClasses: TaxClassBaseFragment[];
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
  onFetchMore: FetchMoreProps;
}

const useStyles = makeStyles(
  {
    root: {
      overflow: "visible",
    },
  },
  { name: "ProductTaxes" },
);

const ProductTaxes: React.FC<ProductTaxesProps> = props => {
  const {
    value,
    disabled,
    taxClasses,
    taxClassDisplayName,
    onChange,
    // onFetchMore,
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card className={classes.root}>
      <CardTitle title={intl.formatMessage(sectionNames.taxes)} />
      <CardContent>
        <Combobox
          data-test-id="category"
          disabled={disabled}
          options={taxClasses.map(choice => ({
            label: choice.name,
            value: choice.id,
          }))}
          value={value ? { value, label: taxClassDisplayName } : null}
          name="taxClassId"
          label={intl.formatMessage(taxesMessages.taxClass)}
          onChange={value =>
            onChange({
              target: { value: value?.value ?? null, name: "taxClassId" },
            } as any)
          }
        />
      </CardContent>
    </Card>
  );
};
ProductTaxes.displayName = "ProductTaxes";
export default ProductTaxes;
