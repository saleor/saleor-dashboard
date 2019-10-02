import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import FormSpacer from "@saleor/components/FormSpacer";
import Grid from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import SingleSelectField from "@saleor/components/SingleSelectField";
import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import { ProductVariantCreateFormData } from "./form";

const useStyles = makeStyles((theme: Theme) => ({
  hr: {
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit / 2
  },
  label: {
    alignSelf: "center"
  },
  shortInput: {
    width: "50%"
  }
}));

export type PriceOrStock = "price" | "stock";
export interface ProductVariantCreatePricesProps {
  attributes: ProductDetails_product_productType_variantAttributes[];
  data: ProductVariantCreateFormData;
  onApplyPriceOrStockChange: (applyToAll: boolean, type: PriceOrStock) => void;
  onApplyToAllChange: (value: string, type: PriceOrStock) => void;
  onAttributeSelect: (id: string, type: PriceOrStock) => void;
  onAttributeValueChange: (
    id: string,
    value: string,
    type: PriceOrStock
  ) => void;
}

const ProductVariantCreatePrices: React.FC<
  ProductVariantCreatePricesProps
> = props => {
  const {
    attributes,
    data,
    onApplyPriceOrStockChange,
    onApplyToAllChange,
    onAttributeSelect,
    onAttributeValueChange
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  const attributeChoices = attributes.map(attribute => ({
    label: attribute.name,
    value: attribute.id
  }));
  const priceAttributeValues = data.price.all
    ? null
    : data.price.attribute
    ? attributes
        .find(attribute => attribute.id === data.price.attribute)
        .values.filter(value =>
          data.attributes
            .find(attribute => attribute.id === data.price.attribute)
            .values.includes(value.slug)
        )
    : [];
  const stockAttributeValues = data.stock.all
    ? null
    : data.stock.attribute
    ? attributes
        .find(attribute => attribute.id === data.stock.attribute)
        .values.filter(value =>
          data.attributes
            .find(attribute => attribute.id === data.stock.attribute)
            .values.includes(value.slug)
        )
    : [];

  return (
    <>
      <Typography color="textSecondary" variant="headline">
        <FormattedMessage
          defaultMessage="Price"
          description="variant price, header"
        />
      </Typography>
      <Hr className={classes.hr} />
      <RadioGroup value={data.price.all ? "applyToAll" : "applyToAttribute"}>
        <FormControlLabel
          value="applyToAll"
          control={<Radio color="primary" />}
          label={intl.formatMessage({
            defaultMessage: "Apply single price to all SKUs"
          })}
          onChange={() => onApplyPriceOrStockChange(true, "price")}
        />
        <FormSpacer />
        <TextField
          className={classes.shortInput}
          inputProps={{
            min: 0,
            type: "number"
          }}
          label={intl.formatMessage({
            defaultMessage: "Price",
            id: "productVariantCreatePricesPriceInputLabel"
          })}
          value={data.price.value}
          onChange={event => onApplyToAllChange(event.target.value, "price")}
        />
        <FormSpacer />
        <FormControlLabel
          value="applyToAttribute"
          control={<Radio color="primary" />}
          label={intl.formatMessage({
            defaultMessage: "Apply unique prices by attribute to each SKU"
          })}
          onChange={() => onApplyPriceOrStockChange(false, "price")}
        />
      </RadioGroup>
      {!data.price.all && (
        <>
          <FormSpacer />
          <Grid variant="inverted">
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
                onChange={event =>
                  onAttributeSelect(event.target.value, "price")
                }
              />
            </div>
          </Grid>
          {priceAttributeValues &&
            priceAttributeValues.map((attributeValue, attributeValueIndex) => (
              <>
                <FormSpacer />
                <Grid variant="inverted">
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
                      fullWidth
                      value={data.price.values[attributeValueIndex].value}
                      onChange={event =>
                        onAttributeValueChange(
                          attributeValue.slug,
                          event.target.value,
                          "price"
                        )
                      }
                    />
                  </div>
                </Grid>
              </>
            ))}
        </>
      )}
      <FormSpacer />
      <Typography color="textSecondary" variant="headline">
        <FormattedMessage
          defaultMessage="Stock"
          description="variant stock, header"
        />
      </Typography>
      <Hr className={classes.hr} />
      <RadioGroup value={data.stock.all ? "applyToAll" : "applyToAttribute"}>
        <FormControlLabel
          value="applyToAll"
          control={<Radio color="primary" />}
          label={intl.formatMessage({
            defaultMessage: "Apply single stock to all SKUs"
          })}
          onChange={() => onApplyPriceOrStockChange(true, "stock")}
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
          onChange={event => onApplyToAllChange(event.target.value, "stock")}
        />
        <FormSpacer />
        <FormControlLabel
          value="applyToAttribute"
          control={<Radio color="primary" />}
          label={intl.formatMessage({
            defaultMessage: "Apply unique stock by attribute to each SKU"
          })}
          onChange={() => onApplyPriceOrStockChange(false, "stock")}
        />
      </RadioGroup>
      {!data.stock.all && (
        <>
          <FormSpacer />
          <Grid variant="inverted">
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
                onChange={event =>
                  onAttributeSelect(event.target.value, "stock")
                }
              />
            </div>
          </Grid>
          {stockAttributeValues &&
            stockAttributeValues.map((attributeValue, attributeValueIndex) => (
              <>
                <FormSpacer />
                <Grid variant="inverted">
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
                      value={data.stock.values[attributeValueIndex].value}
                      onChange={event =>
                        onAttributeValueChange(
                          attributeValue.slug,
                          event.target.value,
                          "stock"
                        )
                      }
                    />
                  </div>
                </Grid>
              </>
            ))}
        </>
      )}
    </>
  );
};

ProductVariantCreatePrices.displayName = "ProductVariantCreatePrices";
export default ProductVariantCreatePrices;
