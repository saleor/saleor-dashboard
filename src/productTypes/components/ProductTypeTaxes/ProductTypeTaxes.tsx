import CardTitle from "@dashboard/components/CardTitle";
import { Combobox } from "@dashboard/components/Combobox";
import { TaxClassBaseFragment } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { taxesMessages } from "@dashboard/taxes/messages";
import { FetchMoreProps } from "@dashboard/types";
import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

interface ProductTypeTaxesProps {
  data: {
    taxClassId: string;
  };
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
  { name: "ProductTypeTaxes" },
);
const ProductTypeTaxes: React.FC<ProductTypeTaxesProps> = props => {
  const { data, disabled, taxClasses, taxClassDisplayName, onChange, onFetchMore } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Card className={classes.root}>
      <CardTitle title={intl.formatMessage(sectionNames.taxes)} />
      <CardContent>
        <Combobox
          // emptyOption
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
      </CardContent>
    </Card>
  );
};

ProductTypeTaxes.displayName = "ProductTypeTaxes";
export default ProductTypeTaxes;
