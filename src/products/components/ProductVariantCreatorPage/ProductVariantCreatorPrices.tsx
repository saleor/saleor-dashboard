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
import CardSpacer from "@saleor/components/CardSpacer";
import { ProductVariantCreateFormData } from "./form";

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

export type PriceOrStock = "price" | "stock";
export interface ProductVariantCreatorPricesProps {
  attributes: ProductDetails_product_productType_variantAttributes[];
  currencySymbol: string;
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

const ProductVariantCreatorPrices: React.FC<ProductVariantCreatorPricesProps> = props => {
  const {
    attributes,
    currencySymbol,
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
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Price",
            description: "variant price, header"
          })}
        />
        <CardContent>
          <RadioGroup
            value={data.price.all ? "applyToAll" : "applyToAttribute"}
          >
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
              InputProps={{
                endAdornment: currencySymbol
              }}
              label={intl.formatMessage({
                defaultMessage: "Price",
                id: "productVariantCreatePricesPriceInputLabel"
              })}
              value={data.price.value}
              onChange={event =>
                onApplyToAllChange(event.target.value, "price")
              }
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
                    onChange={event =>
                      onAttributeSelect(event.target.value, "price")
                    }
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
                              event.target.value,
                              "price"
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
      <CardSpacer />
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Stock",
            description: "variant stock, header"
          })}
        />
        <CardContent>
          <RadioGroup
            value={data.stock.all ? "applyToAll" : "applyToAttribute"}
          >
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
              onChange={event =>
                onApplyToAllChange(event.target.value, "stock")
              }
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
                    onChange={event =>
                      onAttributeSelect(event.target.value, "stock")
                    }
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
                              event.target.value,
                              "stock"
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
    </>
  );
};

ProductVariantCreatorPrices.displayName = "ProductVariantCreatorPrices";
export default ProductVariantCreatorPrices;
