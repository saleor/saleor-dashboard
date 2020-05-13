import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import Grid from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import SingleSelectField from "@saleor/components/SingleSelectField";
import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  ProductVariantCreateFormData,
  VariantCreatorPricesAndSkuMode
} from "./form";
import { getPriceAttributeValues } from "./utils";

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
  { name: "ProductVariantCreatorPrices" }
);

export interface ProductVariantCreatorPricesProps {
  attributes: ProductDetails_product_productType_variantAttributes[];
  currencySymbol: string;
  data: ProductVariantCreateFormData;
  onApplyToAllChange: (applyToAll: VariantCreatorPricesAndSkuMode) => void;
  onApplyToAllPriceChange: (value: string) => void;
  onAttributeSelect: (id: string) => void;
  onAttributeValueChange: (id: string, value: string) => void;
}

const ProductVariantCreatorPrices: React.FC<ProductVariantCreatorPricesProps> = props => {
  const {
    attributes,
    currencySymbol,
    data,
    onApplyToAllChange,
    onApplyToAllPriceChange,
    onAttributeSelect,
    onAttributeValueChange
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  const attributeChoices = attributes.map(attribute => ({
    label: attribute.name,
    value: attribute.id
  }));
  const priceAttributeValues = getPriceAttributeValues(data, attributes);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Price",
          description: "variant price, header"
        })}
      />
      <CardContent>
        <RadioGroup value={data.price.mode}>
          <FormControlLabel
            value="all"
            control={<Radio color="primary" />}
            label={intl.formatMessage({
              defaultMessage: "Apply single price to all SKUs"
            })}
            onChange={() => onApplyToAllChange("all")}
          />
          <FormSpacer />
          <TextField
            className={classes.shortInput}
            inputProps={{
              min: 0,
              type: "number"
            }}
            InputProps={{
              endAdornment: currencySymbol
            }}
            label={intl.formatMessage({
              defaultMessage: "Price",
              id: "productVariantCreatePricesPriceInputLabel"
            })}
            value={data.price.value}
            onChange={event => onApplyToAllPriceChange(event.target.value)}
          />
          <FormSpacer />
          <FormControlLabel
            value="attribute"
            control={<Radio color="primary" />}
            label={intl.formatMessage({
              defaultMessage: "Apply unique prices by attribute to each SKU"
            })}
            onChange={() => onApplyToAllChange("attribute")}
          />
        </RadioGroup>
        {data.price.mode === "attribute" && (
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
                  value={data.price.attribute}
                  onChange={event => onAttributeSelect(event.target.value)}
                />
              </div>
            </Grid>
            {priceAttributeValues &&
              priceAttributeValues.map(attributeValue => (
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
                          defaultMessage: "Price",
                          description: "variant price",
                          id: "productVariantCreatePricesSetPricePlaceholder"
                        })}
                        inputProps={{
                          min: 0,
                          type: "number"
                        }}
                        InputProps={{
                          endAdornment: currencySymbol
                        }}
                        fullWidth
                        value={
                          data.price.values.find(
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

ProductVariantCreatorPrices.displayName = "ProductVariantCreatorPrices";
export default ProductVariantCreatorPrices;
