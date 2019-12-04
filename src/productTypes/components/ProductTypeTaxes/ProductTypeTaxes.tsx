import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import SingleAutocompleteSelectField from "@saleor/components/SingleAutocompleteSelectField";
import { ProductTypeDetails_taxTypes } from "@saleor/productTypes/types/ProductTypeDetails";
import { maybe } from "../../../misc";
import { ProductTypeForm } from "../ProductTypeDetailsPage/ProductTypeDetailsPage";

interface ProductTypeTaxesProps {
  data: {
    taxType: string;
  };
  taxTypeDisplayName: string;
  taxTypes: ProductTypeDetails_taxTypes[];
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const useStyles = makeStyles(
  {
    root: {
      overflow: "visible"
    }
  },
  { name: "ProductTypeTaxes" }
);

const ProductTypeTaxes: React.FC<ProductTypeTaxesProps> = props => {
  const { data, disabled, taxTypes, taxTypeDisplayName, onChange } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card className={classes.root}>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Taxes",
          description: "section header",
          id: "productTypeTaxesHeader"
        })}
      />
      <CardContent>
        <SingleAutocompleteSelectField
          disabled={disabled}
          displayValue={taxTypeDisplayName}
          label={intl.formatMessage({
            defaultMessage: "Taxes",
            id: "productTypeTaxesInputLabel"
          })}
          name={"taxType" as keyof ProductTypeForm}
          onChange={onChange}
          value={data.taxType}
          choices={maybe(
            () =>
              taxTypes.map(c => ({ label: c.description, value: c.taxCode })),
            []
          )}
          InputProps={{
            autoComplete: "off"
          }}
        />
      </CardContent>
    </Card>
  );
};
ProductTypeTaxes.displayName = "ProductTypeTaxes";
export default ProductTypeTaxes;
