import {
  Table,
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
import { ProductErrorFragment } from "@saleor/fragments/types/ProductErrorFragment";
import { ProductVariant_channelListing } from "@saleor/fragments/types/ProductVariant";
import { renderCollection } from "@saleor/misc";
import { ICONBUTTON_SIZE } from "@saleor/theme";
// import { getFormErrors } from "@saleor/utils/errors";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    colAction: {
      padding: 0,
      width: ICONBUTTON_SIZE + theme.spacing()
    },
    colQuantity: {
      textAlign: "right",
      width: 200
    },
    grid: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridTemplateColumns: "1fr 1fr"
    },

    input: {
      padding: theme.spacing(1.5),
      textAlign: "right"
    },
    inputComponent: {
      width: 100
    }
  }),
  { name: "ProductVariantPrice" }
);

interface ProductVariantPriceProps {
  variantChannelListings: ProductVariant_channelListing[];
  errors: ProductErrorFragment[];
  loading?: boolean;
  onChange(event: any);
}

const ProductVariantPrice: React.FC<ProductVariantPriceProps> = props => {
  const { variantChannelListings, loading, onChange } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  // FIXME: Waiting for working mutations
  // const formErrors = getFormErrors(["price", "cost_price"], errors);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Pricing",
          description: "product pricing, section header"
        })}
      />
      <CardContent>
        <Typography>
          {intl.formatMessage({
            defaultMessage:
              "Channels that don’t have assigned prices will use their parent channel to define the price. Price will be converted to channel’s currency"
          })}
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage
                  defaultMessage="Channel Name"
                  description="tabel column header"
                />
              </TableCell>
              <TableCell className={classes.colQuantity}>
                <FormattedMessage
                  defaultMessage="Price"
                  description="tabel column header"
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderCollection(variantChannelListings, listing => (
              <TableRow key={listing.channel.id}>
                <TableCell>{listing.channel.name}</TableCell>
                <TableCell className={classes.colQuantity}>
                  <PriceField
                    error={false}
                    name={`${listing.channel.id}-channel-price`}
                    value={listing.price.amount}
                    currencySymbol={listing.price.currency}
                    onChange={onChange}
                    disabled={loading}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
ProductVariantPrice.displayName = "ProductVariantPrice";
export default ProductVariantPrice;
