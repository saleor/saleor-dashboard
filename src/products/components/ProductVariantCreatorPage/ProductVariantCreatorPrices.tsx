import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { ChannelPriceData } from "@saleor/channels/utils";
import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import Grid from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import PriceField from "@saleor/components/PriceField";
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
    attrInputsContainer: {
      display: "grid",
      gap: theme.spacing(2) + "px",
      gridTemplateColumns:
        "minmax(80px, 150px) repeat(auto-fit, minmax(150px, 250px))"
    },
    channelName: {
      marginBottom: theme.spacing(1)
    },
    container: {
      display: "block"
    },
    hr: {
      marginBottom: theme.spacing(),
      marginTop: theme.spacing(0.5)
    },
    hrAttribute: {
      marginTop: theme.spacing(2)
    },
    inputsContainer: {
      display: "grid",
      gap: theme.spacing(2) + "px",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 250px))"
    },
    label: {
      alignSelf: "center"
    }
  }),
  { name: "ProductVariantCreatorPrices" }
);

export interface ProductVariantCreatorPricesProps {
  attributes: ProductDetails_product_productType_variantAttributes[];
  channelListings: ChannelPriceData[];
  data: ProductVariantCreateFormData;
  onApplyToAllChange: (applyToAll: VariantCreatorPricesAndSkuMode) => void;
  onApplyToAllPriceChange: (channelId: string, value: string) => void;
  onAttributeSelect: (id: string) => void;
  onAttributeValueChange: (
    id: string,
    value: string,
    channelId: string
  ) => void;
}

const ProductVariantCreatorPrices: React.FC<ProductVariantCreatorPricesProps> = props => {
  const {
    attributes,
    channelListings,
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
        <RadioGroup className={classes.container} value={data.price.mode}>
          <FormControlLabel
            value="all"
            control={<Radio color="primary" />}
            label={intl.formatMessage({
              defaultMessage: "Apply single price to all SKUs"
            })}
            onChange={() => onApplyToAllChange("all")}
          />
          {data.price.mode === "all" && (
            <>
              <FormSpacer />
              <div className={classes.inputsContainer}>
                {channelListings?.map(listing => (
                  <div key={listing.id}>
                    <Typography
                      variant="caption"
                      className={classes.channelName}
                    >
                      {listing.name}
                    </Typography>
                    <PriceField
                      name={`${listing.id}-variant-channel-price`}
                      value={
                        data.price.channels.find(
                          channel => channel.channelId === listing.id
                        )?.price
                      }
                      label={intl.formatMessage({
                        defaultMessage: "Price",
                        description: "input label",
                        id: "productVariantCreatePricesSetPricePlaceholder"
                      })}
                      currencySymbol={listing.currency}
                      onChange={event =>
                        onApplyToAllPriceChange(listing.id, event.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </>
          )}
          <FormSpacer />
          <FormControlLabel
            value="attribute"
            control={<Radio color="primary" />}
            label={intl.formatMessage({
              defaultMessage: "Apply unique prices by attribute to each SKU"
            })}
            onChange={() => onApplyToAllChange("attribute")}
          />
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
                priceAttributeValues.map(attributeValue => {
                  const attributesChannels = data.price.values.find(
                    value => value.slug === attributeValue.slug
                  ).value;
                  return (
                    <React.Fragment key={attributeValue.id}>
                      <Hr className={classes.hrAttribute} />
                      <FormSpacer />
                      <div className={classes.attrInputsContainer}>
                        <div className={classes.label}>
                          <Typography>{attributeValue.name}</Typography>
                        </div>
                        {channelListings?.map(listing => (
                          <div key={listing.id}>
                            <Typography
                              variant="caption"
                              className={classes.channelName}
                            >
                              {listing.name}
                            </Typography>
                            <PriceField
                              label={intl.formatMessage({
                                defaultMessage: "Price",
                                description: "input label",
                                id:
                                  "productVariantCreatePricesSetPricePlaceholder"
                              })}
                              currencySymbol={listing.currency}
                              value={
                                attributesChannels.find(
                                  attrChannel =>
                                    attrChannel.channelId === listing.id
                                )?.price || ""
                              }
                              onChange={event =>
                                onAttributeValueChange(
                                  attributeValue.slug,
                                  event.target.value,
                                  listing.id
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </React.Fragment>
                  );
                })}
            </>
          )}
          <FormSpacer />
          <FormControlLabel
            value="skip"
            control={<Radio color="primary" />}
            label={intl.formatMessage({
              defaultMessage: "Skip pricing for now"
            })}
            onChange={() => onApplyToAllChange("skip")}
          />
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

ProductVariantCreatorPrices.displayName = "ProductVariantCreatorPrices";
export default ProductVariantCreatorPrices;
