import {
  Card,
  CardContent,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@material-ui/core";
import {
  ChannelData,
  ChannelPriceAndPreorderArgs,
  ChannelPriceArgs
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
  getFormChannelErrors
} from "@saleor/utils/errors";
import getProductErrorMessage from "@saleor/utils/errors/product";
import React from "react";
import { FormattedMessage, MessageDescriptor, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    caption: {
      fontSize: 14,
      padding: theme.spacing(0, 3, 2, 3)
    },
    colName: {
      fontSize: 14,
      paddingLeft: 0,
      width: "auto"
    },
    colPrice: {
      textAlign: "right",
      verticalAlign: "top",
      width: 200
    },
    colType: {
      fontSize: 14,
      textAlign: "right",
      width: 200
    },
    input: {
      textAlign: "left"
    },
    pricingContent: {
      "&:last-child": {
        paddingBottom: 0
      },
      paddingLeft: 0,
      paddingRight: 0
    },
    table: {
      tableLayout: "fixed"
    }
  }),
  { name: "ProductVariantPrice" }
);

interface ProductVariantPriceProps {
  ProductVariantChannelListings?: ChannelData[];
  errors?: ProductChannelListingErrorFragment[];
  loading?: boolean;
  disabled?: boolean;
  onChange?: (
    id: string,
    data: ChannelPriceArgs | ChannelPriceAndPreorderArgs
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
    disabledMessage
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const formErrors = getFormChannelErrors(["price", "costPrice"], errors);

  if (disabled || !ProductVariantChannelListings.length) {
    return (
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Pricing",
            description: "product pricing, section header"
          })}
        />
        <CardContent>
          <Typography variant="caption">
            {intl.formatMessage(
              disabledMessage || {
                defaultMessage: "There is no channel to define prices for",
                description: "variant pricing section subtitle",
                id: "product variant pricing card disabled subtitle"
              }
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
          defaultMessage: "Pricing",
          description: "product pricing, section header"
        })}
      />
      <CardContent className={classes.pricingContent}>
        <Typography variant="caption" className={classes.caption}>
          {intl.formatMessage({
            defaultMessage:
              "Channels that don’t have assigned prices will use their parent channel to define the price. Price will be converted to channel’s currency",
            description: "info text"
          })}
        </Typography>
        <ResponsiveTable className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage
                  defaultMessage="Channel Name"
                  description="tabel column header"
                />
              </TableCell>
              <TableCell className={classes.colType}>
                <FormattedMessage
                  defaultMessage="Selling Price"
                  description="tabel column header"
                />
              </TableCell>
              <TableCell className={classes.colType}>
                <FormattedMessage
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
                  listing.id
                );
                const costPriceError = getFormChannelError(
                  formErrors.costPrice,
                  listing.id
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
                            defaultMessage: "Price"
                          })}
                          name={`${listing.id}-channel-price`}
                          value={listing.price || ""}
                          currencySymbol={listing.currency}
                          onChange={e =>
                            onChange(listing.id, {
                              costPrice: listing.costPrice,
                              price: e.target.value,
                              preorderThreshold: listing.preorderThreshold
                            })
                          }
                          disabled={loading}
                          required
                          hint={
                            priceError &&
                            getProductErrorMessage(priceError, intl)
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
                            defaultMessage: "Cost",
                            description: "tabel column header"
                          })}
                          name={`${listing.id}-channel-costPrice`}
                          value={listing.costPrice || ""}
                          currencySymbol={listing.currency}
                          onChange={e =>
                            onChange(listing.id, {
                              costPrice: e.target.value,
                              price: listing.price,
                              preorderThreshold: listing.preorderThreshold
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
                    <FormattedMessage defaultMessage="No channels found" />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </ResponsiveTable>
      </CardContent>
    </Card>
  );
};
ProductVariantPrice.displayName = "ProductVariantPrice";
export default ProductVariantPrice;
