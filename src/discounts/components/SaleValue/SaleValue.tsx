// @ts-strict-ignore
import CardTitle from "@dashboard/components/CardTitle";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import TableRowLink from "@dashboard/components/TableRowLink";
import { DiscountErrorFragment } from "@dashboard/graphql";
import { renderCollection } from "@dashboard/misc";
import { getFormErrors } from "@dashboard/utils/errors";
import getDiscountErrorMessage from "@dashboard/utils/errors/discounts";
import { Card, TableBody, TableCell, TableHead, Typography } from "@material-ui/core";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { SaleDetailsPageFormData } from "../SaleDetailsPage";
import SaleValueTextField from "./SaleValueTextField";
import { useStyles } from "./styles";
import { SaleValueInputOnChangeType } from "./types";

export interface SaleValueProps {
  data: SaleDetailsPageFormData;
  disabled: boolean;
  errors: DiscountErrorFragment[];
  onChange: SaleValueInputOnChangeType;
}

const numberOfColumns = 2;
const SaleValue: React.FC<SaleValueProps> = ({ data, disabled, errors, onChange }) => {
  const { type } = data;
  const intl = useIntl();
  const classes = useStyles({});
  const formErrors = getFormErrors(["value"], errors);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "wHdMAX",
          defaultMessage: "Value",
          description: "sale value, header",
        })}
      />
      <ResponsiveTable className={classes.table}>
        <colgroup>
          <col />
          <col className={classes.colValue} />
        </colgroup>
        <TableHead>
          <TableCell className={classes.colName}>
            <span>
              <FormattedMessage
                id="Hj3T7P"
                defaultMessage="Channel name"
                description="column title"
              />
            </span>
          </TableCell>
          <TableCell className={classes.colType}>
            <span>
              <FormattedMessage
                id="wHdMAX"
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
              const error = formErrors.value?.channels?.find(id => id === listing.id);

              return (
                <TableRowLink key={listing?.id || `skeleton-${index}`} className={classes.row}>
                  <TableCell>
                    <Typography>{listing?.name || <Skeleton />}</Typography>
                  </TableCell>
                  <TableCell>
                    {listing ? (
                      <SaleValueTextField
                        dataType={type}
                        helperText={error ? getDiscountErrorMessage(formErrors.value, intl) : ""}
                        error={!!error}
                        disabled={disabled}
                        listing={listing}
                        onChange={onChange}
                      />
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                </TableRowLink>
              );
            },
            () => (
              <TableRowLink>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage id="/glQgs" defaultMessage="No channels found" />
                </TableCell>
              </TableRowLink>
            ),
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};

SaleValue.displayName = "SaleValue";
export default SaleValue;
