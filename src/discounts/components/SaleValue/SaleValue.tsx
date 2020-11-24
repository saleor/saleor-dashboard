import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableHead from "@saleor/components/TableHead";
import { DiscountErrorFragment } from "@saleor/fragments/types/DiscountErrorFragment";
import { renderCollection } from "@saleor/misc";
import { SaleType } from "@saleor/types/globalTypes";
import { getFormErrors } from "@saleor/utils/errors";
import getDiscountErrorMessage from "@saleor/utils/errors/discounts";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { SaleDetailsPageFormData } from "../SaleDetailsPage";
import { useStyles } from "./styles";

export interface SaleValueProps {
  data: SaleDetailsPageFormData;
  disabled: boolean;
  errors: DiscountErrorFragment[];
  onChange: (channelId: string, discountValue: string) => void;
}

const numberOfColumns = 2;

const SaleValue: React.FC<SaleValueProps> = ({
  data,
  disabled,
  errors,
  onChange
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const formErrors = getFormErrors(["value"], errors);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Value",
          description: "sale value, header"
        })}
      />
      <CardContent className={classes.card}>
        <Typography variant="caption" className={classes.info}>
          <FormattedMessage
            defaultMessage="Channels that don’t have assigned discounts will use their parent channel to define the price. Price will be converted to channel’s currency"
            description="channels sale info"
          />
        </Typography>
        <div className={classes.tableContainer}>
          <ResponsiveTable className={classes.table}>
            <TableHead colSpan={numberOfColumns} disabled={disabled} items={[]}>
              <TableCell className={classes.colName}>
                <span>
                  <FormattedMessage
                    defaultMessage="Channel name"
                    description="column title"
                  />
                </span>
              </TableCell>
              <TableCell className={classes.colType}>
                <span>
                  <FormattedMessage
                    defaultMessage="Value"
                    description="sale value, header"
                  />
                </span>
              </TableCell>
            </TableHead>
            <TableBody>
              {renderCollection(
                data.channelListings,
                (listing, index) => {
                  const error = formErrors.value?.channels?.find(
                    id => id === listing.id
                  );
                  return (
                    <TableRow
                      key={listing?.id || `skeleton-${index}`}
                      className={classes.row}
                    >
                      <TableCell>
                        <Typography>{listing?.name || <Skeleton />}</Typography>
                      </TableCell>
                      <TableCell>
                        {listing ? (
                          <TextField
                            disabled={disabled}
                            helperText={
                              error
                                ? getDiscountErrorMessage(
                                    formErrors.value,
                                    intl
                                  )
                                : ""
                            }
                            name="value"
                            onChange={e => onChange(listing.id, e.target.value)}
                            label={intl.formatMessage({
                              defaultMessage: "Discount Value",
                              description: "sale discount"
                            })}
                            value={listing.discountValue || ""}
                            type="number"
                            fullWidth
                            inputProps={{
                              min: 0
                            }}
                            InputProps={{
                              endAdornment:
                                data.type === SaleType.FIXED
                                  ? listing.currency
                                  : "%"
                            }}
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
        </div>
      </CardContent>
    </Card>
  );
};

SaleValue.displayName = "SaleValue";
export default SaleValue;
