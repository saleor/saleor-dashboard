import FormControlLabel from "@material-ui/core/FormControlLabel";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import FormSpacer from "@saleor/components/FormSpacer";
import Grid from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import SingleSelectField from "@saleor/components/SingleSelectField";
import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import CardTitle from "@saleor/components/CardTitle";
import { ProductVariantCreateFormData } from "./form";
import { getStockAttributeValues } from "./utils";

const useStyles = makeStyles(
  theme => ({
    hr: {
      marginBottom: theme.spacing(),
      marginTop: theme.spacing(0.5)
    },
    hrAttribute: {
      marginTop: theme.spacing(2)
    },
    label: {
      alignSelf: "center"
    },
    shortInput: {
      width: "33%"
    }
  }),
  { name: "ProductVariantCreatorStock" }
);

export interface ProductVariantCreatorStockProps {
  attributes: ProductDetails_product_productType_variantAttributes[];
  data: ProductVariantCreateFormData;
  onApplyToAllChange: (applyToAll: boolean) => void;
  onApplyToAllStockChange: (value: string) => void;
  onAttributeSelect: (id: string) => void;
  onAttributeValueChange: (id: string, value: string) => void;
}

const ProductVariantCreatorStock: React.FC<ProductVariantCreatorStockProps> = props => {
  const {
    attributes,
    data,
    onApplyToAllChange,
    onApplyToAllStockChange,
    onAttributeSelect,
    onAttributeValueChange
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  const attributeChoices = attributes.map(attribute => ({
    label: attribute.name,
    value: attribute.id
  }));
  const stockAttributeValues = getStockAttributeValues(data, attributes);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Stock and Warehousing",
          description: "variant stock, header"
        })}
      />
      <CardContent>
        <RadioGroup value={data.stock.all ? "applyToAll" : "applyToAttribute"}>
          <FormControlLabel
            value="applyToAll"
            control={<Radio color="primary" />}
            label={intl.formatMessage({
              defaultMessage: "Apply single stock to all SKUs"
            })}
            onChange={() => onApplyToAllChange(true)}
          />
          <FormSpacer />
          <TextField
            className={classes.shortInput}
            inputProps={{
              min: 0,
              type: "number"
            }}
            label={intl.formatMessage({
              defaultMessage: "Stock",
              id: "productVariantCreatePricesStockInputLabel"
            })}
            value={data.stock.value}
            onChange={event => onApplyToAllStockChange(event.target.value)}
          />
          <FormSpacer />
          <FormControlLabel
            value="applyToAttribute"
            control={<Radio color="primary" />}
            label={intl.formatMessage({
              defaultMessage: "Apply unique stock by attribute to each SKU"
            })}
            onChange={() => onApplyToAllChange(false)}
          />
        </RadioGroup>
        {!data.stock.all && (
          <>
            <FormSpacer />
            <Grid variant="uniform">
              <div className={classes.label}>
                <Typography>
                  <FormattedMessage
                    defaultMessage="Choose attribute"
                    description="variant attribute"
                  />
                </Typography>
              </div>
              <div>
                <SingleSelectField
                  choices={attributeChoices}
                  label={intl.formatMessage({
                    defaultMessage: "Attribute",
                    description: "variant attribute"
                  })}
                  value={data.stock.attribute}
                  onChange={onAttributeSelect}
                />
              </div>
            </Grid>
            {stockAttributeValues &&
              stockAttributeValues.map(attributeValue => (
                <React.Fragment key={attributeValue.id}>
                  <Hr className={classes.hrAttribute} />
                  <FormSpacer />
                  <Grid variant="uniform">
                    <div className={classes.label}>
                      <Typography>{attributeValue.name}</Typography>
                    </div>
                    <div>
                      <TextField
                        label={intl.formatMessage({
                          defaultMessage: "Stock",
                          description: "variant stock",
                          id: "productVariantCreatePricesSetStockPlaceholder"
                        })}
                        fullWidth
                        value={
                          data.stock.values.find(
                            value => value.slug === attributeValue.slug
                          ).value
                        }
                        onChange={event =>
                          onAttributeValueChange(
                            attributeValue.slug,
                            event.target.value
                          )
                        }
                      />
                    </div>
                  </Grid>
                </React.Fragment>
              ))}
          </>
        )}
      </CardContent>
    </Card>
  );
};

ProductVariantCreatorStock.displayName = "ProductVariantCreatorStock";
export default ProductVariantCreatorStock;
