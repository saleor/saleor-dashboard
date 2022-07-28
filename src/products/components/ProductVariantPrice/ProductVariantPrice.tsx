import {
  Card,
  CardContent,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import {
  ChannelData,
  ChannelPriceAndPreorderArgs,
  ChannelPriceArgs,
} from "@saleor/channels/utils";
import CardTitle from "@saleor/components/CardTitle";
import PriceField from "@saleor/components/PriceField";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { ProductChannelListingErrorFragment } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import {
  getFormChannelError,
  getFormChannelErrors,
} from "@saleor/utils/errors";
import getProductErrorMessage from "@saleor/utils/errors/product";
import React from "react";
import { FormattedMessage, MessageDescriptor, useIntl } from "react-intl";

const useStyles = makeStyles(
  () => ({
    colPrice: {
      textAlign: "right",
      verticalAlign: "top",
      width: 200,
    },
    colType: {
      fontSize: 14,
      textAlign: "right",
      width: 200,
    },
    input: {
      textAlign: "left",
    },
    pricingContent: {
      "&:last-child": {
        paddingBottom: 0,
      },
      paddingLeft: 0,
      paddingRight: 0,
    },
    table: {
      tableLayout: "fixed",
    },
  }),
  { name: "ProductVariantPrice" },
);

interface ProductVariantPriceProps {
  ProductVariantChannelListings?: ChannelData[];
  errors?: ProductChannelListingErrorFragment[];
  loading?: boolean;
  disabled?: boolean;
  onChange?: (
    id: string,
    data: ChannelPriceArgs | ChannelPriceAndPreorderArgs,
  ) => void;
  disabledMessage?: MessageDescriptor;
}

const numberOfColumns = 2;

const ProductVariantPrice: React.FC<ProductVariantPriceProps> = props => {
  const {
    disabled = false,
    errors = [],
    ProductVariantChannelListings = [],
    loading,
    onChange,
    disabledMessage,
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const formErrors = getFormChannelErrors(["price", "costPrice"], errors);

  if (disabled || !ProductVariantChannelListings.length) {
    return (
      <Card>
        <CardTitle
          title={intl.formatMessage({
            id: "Xm9qOu",
            defaultMessage: "Pricing",
            description: "product pricing, section header",
          })}
        />
        <CardContent>
          <Typography variant="caption">
            {intl.formatMessage(
              disabledMessage || {
                id: "e48Igh",
                defaultMessage:
                  "Assign this variant to a channel in the product channel manager to define prices",
                description: "variant pricing section subtitle",
              },
            )}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "Xm9qOu",
          defaultMessage: "Pricing",
          description: "product pricing, section header",
        })}
      />
      <CardContent>
        <Typography variant="body2">
          {intl.formatMessage({
            id: "VvA7ai",
            defaultMessage:
              "Channels that don’t have assigned prices will use their parent channel to define the price. Price will be converted to channel’s currency",
            description: "info text",
          })}
        </Typography>
      </CardContent>
      <ResponsiveTable className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>
              <FormattedMessage
                id="c8UT0c"
                defaultMessage="Channel Name"
                description="tabel column header"
              />
            </TableCell>
            <TableCell className={classes.colType}>
              <FormattedMessage
                id="JFtFgc"
                defaultMessage="Selling Price"
                description="tabel column header"
              />
            </TableCell>
            <TableCell className={classes.colType}>
              <FormattedMessage
                id="2zCmiR"
                defaultMessage="Cost price"
                description="tabel column header"
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renderCollection(
            ProductVariantChannelListings,
            (listing, index) => {
              const priceError = getFormChannelError(
                formErrors.price,
                listing.id,
              );
              const costPriceError = getFormChannelError(
                formErrors.costPrice,
                listing.id,
              );

              return (
                <TableRow key={listing?.id || `skeleton-${index}`}>
                  <TableCell>{listing?.name || <Skeleton />}</TableCell>
                  <TableCell className={classes.colPrice}>
                    {listing ? (
                      <PriceField
                        className={classes.input}
                        error={!!priceError}
                        label={intl.formatMessage({
                          id: "b1zuN9",
                          defaultMessage: "Price",
                        })}
                        name={`${listing.id}-channel-price`}
                        value={listing.price || ""}
                        currencySymbol={listing.currency}
                        onChange={e =>
                          onChange(listing.id, {
                            costPrice: listing.costPrice,
                            price: e.target.value,
                            preorderThreshold: listing.preorderThreshold,
                          })
                        }
                        disabled={loading}
                        required
                        hint={
                          priceError && getProductErrorMessage(priceError, intl)
                        }
                      />
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell className={classes.colPrice}>
                    {listing ? (
                      <PriceField
                        className={classes.input}
                        error={!!costPriceError}
                        label={intl.formatMessage({
                          id: "KQSONM",
                          defaultMessage: "Cost",
                          description: "tabel column header",
                        })}
                        name={`${listing.id}-channel-costPrice`}
                        value={listing.costPrice || ""}
                        currencySymbol={listing.currency}
                        onChange={e =>
                          onChange(listing.id, {
                            costPrice: e.target.value,
                            price: listing.price,
                            preorderThreshold: listing.preorderThreshold,
                          })
                        }
                        disabled={loading}
                        hint={
                          costPriceError
                            ? getProductErrorMessage(costPriceError, intl)
                            : ""
                        }
                      />
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                </TableRow>
              );
            },
            () => (
              <TableRow>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage
                    id="/glQgs"
                    defaultMessage="No channels found"
                  />
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};
ProductVariantPrice.displayName = "ProductVariantPrice";
export default ProductVariantPrice;
