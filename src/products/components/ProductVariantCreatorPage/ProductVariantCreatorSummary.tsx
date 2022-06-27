import { Card, TextField } from "@material-ui/core";
import blue from "@material-ui/core/colors/blue";
import cyan from "@material-ui/core/colors/cyan";
import green from "@material-ui/core/colors/green";
import purple from "@material-ui/core/colors/purple";
import yellow from "@material-ui/core/colors/yellow";
import { ChannelPriceData } from "@saleor/channels/utils";
import CardTitle from "@saleor/components/CardTitle";
import Hr from "@saleor/components/Hr";
import PriceField from "@saleor/components/PriceField";
import {
  BulkProductErrorFragment,
  ProductFragment,
  ProductVariantBulkCreateInput,
  WarehouseFragment,
} from "@saleor/graphql";
import { DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import { getFormErrors } from "@saleor/utils/errors";
import { getBulkProductErrorMessage } from "@saleor/utils/errors/product";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Attribute, ChannelPrice, ProductVariantCreateFormData } from "./form";

export interface ProductVariantCreatorSummaryProps {
  attributes: ProductFragment["productType"]["variantAttributes"];
  channelListings: ChannelPriceData[];
  data: ProductVariantCreateFormData;
  errors: BulkProductErrorFragment[];
  warehouses: WarehouseFragment[];
  onVariantSkuChange: (variantIndex: number, value: string) => void;
  onVariantStockDataChange: (
    variantIndex: number,
    warehouseId: string,
    value: string,
  ) => void;
  onVariantDelete: (variantIndex: number) => void;
  onVariantPriceDataChange: (variantIndex: number, value: ChannelPrice) => void;
}
type ClassKey =
  | "attributeValue"
  | "card"
  | "col"
  | "colHeader"
  | "colName"
  | "colPrice"
  | "colSku"
  | "colStock"
  | "delete"
  | "hr"
  | "input"
  | "summary";

const colors = [blue, cyan, green, purple, yellow].map(color => color[800]);

const useStyles = makeStyles<ProductVariantCreatorSummaryProps, ClassKey>(
  theme => ({
    attributeValue: {
      display: "inline-block",
      marginRight: theme.spacing(1),
    },
    card: {
      paddingBottom: theme.spacing(),
    },
    col: {
      ...theme.typography.body1,
      fontSize: 14,
    },
    colHeader: {
      ...theme.typography.body1,
      fontSize: 14,
      paddingTop: theme.spacing(3),
    },
    colName: {
      "&:not($colHeader)": {
        paddingTop: theme.spacing(2),
      },
      paddingLeft: theme.spacing(3),
    },
    colPrice: {},
    colSku: {},
    colStock: {},
    delete: {
      marginTop: theme.spacing(0.5),
    },
    hr: {
      gridColumn: props =>
        `span ${4 +
          props.data.variants[0].stocks.length +
          props.data.variants[0].channelListings.length}`,
    },
    input: {
      "& input": {
        padding: "16px 12px 17px",
      },
    },
    summary: {
      columnGap: theme.spacing(3),
      display: "grid",
      gridTemplateColumns: props =>
        `minmax(180px, auto) repeat(${props.data.variants[0].channelListings
          .length +
          props.data.variants[0].stocks
            .length}, minmax(180px, auto)) 220px 64px`,
      overflowX: "scroll",
      rowGap: theme.spacing(),
      paddingBottom: 3,
    },
  }),
  {
    name: "ProductVariantCreatorSummary",
  },
);

function getVariantName(
  variant: ProductVariantBulkCreateInput,
  attributes: Attribute[],
): string[] {
  return attributes.reduce(
    (acc, attribute) => [
      ...acc,
      attribute.values?.find(value => {
        const variantAttributeValue = variant.attributes.find(
          variantAttribute => variantAttribute.id === attribute.id,
        );
        return (
          variantAttributeValue.values?.[0] === value?.slug ||
          variantAttributeValue.boolean === value.value.boolean
        );
      })?.value?.name,
    ],
    [],
  );
}

const ProductVariantCreatorSummary: React.FC<ProductVariantCreatorSummaryProps> = props => {
  const {
    channelListings,
    data,
    errors,
    warehouses,
    onVariantPriceDataChange,
    onVariantSkuChange,
    onVariantDelete,
    onVariantStockDataChange,
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Card className={classes.card}>
      <CardTitle
        title={intl.formatMessage({
          id: "S5PVx1",
          defaultMessage: "Created Variants",
          description: "variant creator summary card header",
        })}
      />
      <div className={classes.summary}>
        <div
          className={classNames(
            classes.col,
            classes.colHeader,
            classes.colName,
          )}
        >
          <FormattedMessage
            id="V76IV7"
            defaultMessage="Variant"
            description="variant name"
          />
        </div>

        {channelListings.map(listing => (
          <div
            key={listing.id}
            className={classNames(
              classes.col,
              classes.colHeader,
              classes.colPrice,
            )}
          >
            <FormattedMessage
              id="CrbI/c"
              defaultMessage="{channel} Price"
              description="variant channel price"
              values={{
                channel: listing.name,
              }}
            />
          </div>
        ))}

        {data.warehouses.map(warehouseId => (
          <div
            className={classNames(
              classes.col,
              classes.colHeader,
              classes.colStock,
            )}
            key={warehouseId}
          >
            {warehouses.find(warehouse => warehouse.id === warehouseId).name}
          </div>
        ))}
        <div
          className={classNames(classes.col, classes.colHeader, classes.colSku)}
        >
          <FormattedMessage id="k4brJy" defaultMessage="SKU" />
        </div>
        <div className={classNames(classes.col, classes.colHeader)} />
        <Hr className={classes.hr} />
        {data.variants.map((variant, variantIndex) => {
          const variantErrors = errors.filter(
            error => error.index === variantIndex,
          );
          const variantFormErrors = getFormErrors(
            ["price", "quantity", "sku"],
            variantErrors,
          );
          return (
            <React.Fragment
              key={variant.attributes
                .map(attribute => attribute.values?.[0] ?? attribute.boolean)
                .join(":")}
            >
              <div className={classNames(classes.col, classes.colName)}>
                {getVariantName(variant, data.attributes).map(
                  (value, valueIndex) => (
                    <span
                      className={classes.attributeValue}
                      style={{
                        color: colors[valueIndex % colors.length],
                      }}
                      key={`${value}:${valueIndex}`}
                    >
                      {value}
                    </span>
                  ),
                )}
              </div>
              {channelListings.map(listing => {
                const error = variantFormErrors.price?.channels?.find(
                  id => id === listing.id,
                );
                return (
                  <div
                    key={listing.id}
                    className={classNames(classes.col, classes.colPrice)}
                  >
                    <PriceField
                      className={classes.input}
                      currencySymbol={listing.currency}
                      error={!!error}
                      hint={
                        error
                          ? getBulkProductErrorMessage(
                              variantFormErrors.price,
                              intl,
                            )
                          : ""
                      }
                      value={
                        variant.channelListings?.find(
                          channel => channel.channelId === listing.id,
                        )?.price
                      }
                      required
                      onChange={event =>
                        onVariantPriceDataChange(variantIndex, {
                          channelId: listing.id,
                          price: event.target.value,
                        })
                      }
                    />
                  </div>
                );
              })}
              {variant.stocks.map(stock => (
                <div
                  className={classNames(classes.col, classes.colStock)}
                  key={stock.warehouse}
                >
                  <TextField
                    className={classes.input}
                    error={!!variantFormErrors.quantity}
                    helperText={getBulkProductErrorMessage(
                      variantFormErrors.quantity,
                      intl,
                    )}
                    inputProps={{
                      min: 0,
                      type: "number",
                    }}
                    fullWidth
                    value={stock.quantity}
                    onChange={event =>
                      onVariantStockDataChange(
                        variantIndex,
                        stock.warehouse,
                        event.target.value,
                      )
                    }
                  />
                </div>
              ))}
              <div className={classNames(classes.col, classes.colSku)}>
                <TextField
                  name="sku"
                  className={classes.input}
                  error={!!variantFormErrors.sku}
                  helperText={getBulkProductErrorMessage(
                    variantFormErrors.sku,
                    intl,
                  )}
                  fullWidth
                  value={variant.sku}
                  onChange={event =>
                    onVariantSkuChange(variantIndex, event.target.value)
                  }
                />
              </div>
              <div className={classes.col}>
                <IconButton
                  variant="secondary"
                  className={classes.delete}
                  color="primary"
                  onClick={() => onVariantDelete(variantIndex)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
              {variantIndex !== data.variants.length - 1 && (
                <Hr className={classes.hr} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </Card>
  );
};

ProductVariantCreatorSummary.displayName = "ProductVariantCreatorSummary";
export default ProductVariantCreatorSummary;
