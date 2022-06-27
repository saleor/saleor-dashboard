import { Card, CardContent } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import Hr from "@saleor/components/Hr";
import SingleAutocompleteSelectField from "@saleor/components/SingleAutocompleteSelectField";
import { TaxTypeFragment } from "@saleor/graphql";
import { FormChange } from "@saleor/hooks/useForm";
import { sectionNames } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

export interface ProductTaxesProps {
  data: {
    changeTaxCode: boolean;
    chargeTaxes: boolean;
    taxCode: string;
  };
  disabled: boolean;
  selectedTaxTypeDisplayName: string;
  taxTypes: TaxTypeFragment[];
  onChange: FormChange;
  onTaxTypeChange: FormChange;
}

const useStyles = makeStyles(
  theme => ({
    content: {
      paddingTop: theme.spacing(2),
    },
    hr: {
      margin: theme.spacing(2, 0),
    },
    select: {
      margin: theme.spacing(2, 0),
    },
  }),
  {
    name: "ProductTaxes",
  },
);

const ProductTaxes: React.FC<ProductTaxesProps> = ({
  data,
  disabled,
  selectedTaxTypeDisplayName,
  taxTypes,
  onChange,
  onTaxTypeChange,
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <Card>
      <CardTitle title={intl.formatMessage(sectionNames.taxes)} />
      <CardContent className={classes.content}>
        <ControlledCheckbox
          checked={data.changeTaxCode}
          disabled={disabled}
          data-test-id="override-tax-type"
          label={intl.formatMessage({
            id: "iYH3Y7",
            defaultMessage: "Override the product type's tax rate",
            description: "checkbox",
          })}
          name="changeTaxCode"
          onChange={onChange}
        />
        <Hr className={classes.hr} />
        <ControlledCheckbox
          checked={data.chargeTaxes}
          disabled={disabled}
          data-test-id="charge-taxes"
          label={intl.formatMessage({
            id: "TfY/Pi",
            defaultMessage: "Charge taxes on this product",
            description: "checkbox",
          })}
          name="chargeTaxes"
          onChange={onChange}
        />
        {data.changeTaxCode && (
          <SingleAutocompleteSelectField
            className={classes.select}
            disabled={disabled}
            displayValue={selectedTaxTypeDisplayName}
            data-test-id="select-tax-type"
            label={intl.formatMessage({
              id: "CdIHMu",
              defaultMessage: "Tax Rate",
              description: "select tax ratte",
            })}
            name="taxCode"
            onChange={onTaxTypeChange}
            value={data.taxCode}
            choices={
              taxTypes?.map(taxType => ({
                label: taxType.description,
                value: taxType.taxCode,
              })) || []
            }
            InputProps={{
              autoComplete: "off",
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

ProductTaxes.displayName = "ProductTaxes";
export default ProductTaxes;
