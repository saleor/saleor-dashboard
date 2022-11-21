import { Card, CardContent } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import SingleAutocompleteSelectField from "@saleor/components/SingleAutocompleteSelectField";
import { ProductTypeDetailsQuery } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { maybe } from "../../../misc";
import { ProductTypeForm } from "../ProductTypeDetailsPage/ProductTypeDetailsPage";

interface ProductTypeTaxesProps {
  data: {
    taxType: string;
  };
  taxTypeDisplayName: string;
  taxTypes: ProductTypeDetailsQuery["taxTypes"];
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
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
  const { data, disabled, taxTypes, taxTypeDisplayName, onChange } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card className={classes.root}>
      <CardTitle
        title={intl.formatMessage({
          id: "mUb8Gt",
          defaultMessage: "Taxes",
          description: "section header",
        })}
      />
      <CardContent>
        <SingleAutocompleteSelectField
          disabled={disabled}
          displayValue={taxTypeDisplayName}
          label={intl.formatMessage({
            id: "9xUIAh",
            defaultMessage: "Tax group",
          })}
          name={"taxType" as keyof ProductTypeForm}
          onChange={onChange}
          value={data.taxType}
          choices={maybe(
            () =>
              taxTypes.map(c => ({ label: c.description, value: c.taxCode })),
            [],
          )}
          InputProps={{
            autoComplete: "off",
          }}
        />
      </CardContent>
    </Card>
  );
};
ProductTypeTaxes.displayName = "ProductTypeTaxes";
export default ProductTypeTaxes;
