import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import CardTitle from "@saleor/components/CardTitle";
import PriceField from "@saleor/components/PriceField";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { renderCollection } from "@saleor/misc";
import { ProductVariantChannelData } from "@saleor/products/components/ProductVariantPage";
import { ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_productChannelListingErrors } from "@saleor/products/types/ProductVariantChannelListingUpdate";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
  ProductVariantChannelListings: ProductVariantChannelData[];
  errors: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_productChannelListingErrors[];
  loading?: boolean;
  onChange: (id: string, price: number) => void;
}

const numberOfColumns = 2;

const ProductVariantPrice: React.FC<ProductVariantPriceProps> = props => {
  const { errors, ProductVariantChannelListings, loading, onChange } = props;
  const classes = useStyles(props);
  const intl = useIntl();

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
              {/* <TableCell className={classes.colType}>
                <FormattedMessage
                  defaultMessage="Cost Price"
                  description="tabel column header"
                />
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {renderCollection(
              ProductVariantChannelListings,
              (listing, index) => {
                const error = errors?.filter(
                  error => error.channels[0] === listing.id
                );
                const hasWrongValue = listing.price < 0;
                return (
                  <TableRow key={listing?.id || `skeleton-${index}`}>
                    <TableCell>{listing?.name || <Skeleton />}</TableCell>
                    <TableCell className={classes.colPrice}>
                      {listing ? (
                        <PriceField
                          className={classes.input}
                          error={!!error?.length || hasWrongValue}
                          label={intl.formatMessage({
                            defaultMessage: "Price"
                          })}
                          name={`${listing.id}-channel-price`}
                          value={listing.price || ""}
                          currencySymbol={listing.currency}
                          onChange={e => onChange(listing.id, e.target.value)}
                          disabled={loading}
                          hint={
                            error?.length
                              ? error[0].message
                              : hasWrongValue
                              ? intl.formatMessage({
                                  defaultMessage:
                                    "Product price cannot be lower than 0."
                                })
                              : ""
                          }
                          required
                        />
                      ) : (
                        <Skeleton />
                      )}
                    </TableCell>
                    {/* FIXME: Waiting for costPrice */}
                    {/* <TableCell className={classes.colPrice}>
                    {listing?.channel ? (
                      <PriceField
                        className={classes.input}
                        error={false}
                        name={`${listing.id}-channel-price`}
                        value={listing.price}
                        currencySymbol={listing.currency}
                        onChange={e =>
                          onChange(listing.id, e.target.value)
                        }
                        disabled={loading}
                      />
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell> */}
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
