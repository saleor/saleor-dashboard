import {
  Card,
  CardContent,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import { FormSpacer } from "@saleor/components/FormSpacer";
import RadioGroupField from "@saleor/components/RadioGroupField";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableHead from "@saleor/components/TableHead";
import TextFieldWithChoice from "@saleor/components/TextFieldWithChoice";
import { ChannelInput } from "@saleor/discounts/handlers";
import { DiscountTypeEnum } from "@saleor/discounts/types";
import { DiscountErrorFragment } from "@saleor/graphql";
import { renderCollection } from "@saleor/misc";
import { getFormErrors } from "@saleor/utils/errors";
import getDiscountErrorMessage from "@saleor/utils/errors/discounts";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { translateVoucherTypes } from "../../translations";
import { VoucherDetailsPageFormData } from "../VoucherDetailsPage";
import { useStyles } from "./styles";

interface VoucherValueProps {
  data: VoucherDetailsPageFormData;
  errors: DiscountErrorFragment[];
  disabled: boolean;
  variant: string;
  onChange: (event: React.ChangeEvent<any>) => void;
  onChannelChange: (channelId: string, input: ChannelInput) => void;
}

export enum VoucherType {
  ENTIRE_ORDER = "ENTIRE_ORDER",
  SPECIFIC_PRODUCT = "SPECIFIC_PRODUCT",
}

const numberOfColumns = 2;

const VoucherValue: React.FC<VoucherValueProps> = props => {
  const { data, disabled, errors, variant, onChange, onChannelChange } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const formErrors = getFormErrors(["discountValue", "type"], errors);

  const translatedVoucherTypes = translateVoucherTypes(intl);
  const voucherTypeChoices = Object.values(VoucherType).map(type => ({
    label: translatedVoucherTypes[type],
    value: type,
  }));

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "/oaqFS",
          defaultMessage: "Value",
          description: "section header",
        })}
      />
      <CardContent>
        <Typography variant="caption">
          <FormattedMessage
            id="K+ROF8"
            defaultMessage="Channels that don’t have assigned discounts will use their parent channel to define the price. Price will be converted to channel’s currency"
          />
        </Typography>
        <div className={classes.tableContainer}>
          <ResponsiveTable className={classes.table}>
            <TableHead colSpan={numberOfColumns} disabled={disabled} items={[]}>
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
                    id="1shOIS"
                    defaultMessage="Price"
                    description="column title"
                  />
                </span>
              </TableCell>
            </TableHead>
            <TableBody>
              {renderCollection(
                data.channelListings,
                (listing, index) => {
                  const error = formErrors.discountValue?.channels?.find(
                    id => id === listing.id,
                  );
                  return (
                    <TableRow key={listing?.id || `skeleton-${index}`}>
                      <TableCell>
                        <Typography>{listing?.name || <Skeleton />}</Typography>
                      </TableCell>
                      <TableCell className={classes.colPrice}>
                        {listing ? (
                          <TextFieldWithChoice
                            disabled={disabled}
                            error={!!error?.length}
                            ChoiceProps={{
                              label:
                                data.discountType ===
                                DiscountTypeEnum.VALUE_FIXED
                                  ? listing.currency
                                  : "%",
                              name: "discountType" as keyof FormData,
                              values: null,
                            }}
                            helperText={
                              error
                                ? getDiscountErrorMessage(
                                    formErrors.discountValue,
                                    intl,
                                  )
                                : ""
                            }
                            name={"value"}
                            onChange={e =>
                              onChannelChange(listing.id, {
                                discountValue: e.target.value,
                              })
                            }
                            label={intl.formatMessage({
                              id: "mmcHeH",
                              defaultMessage: "Discount Value",
                            })}
                            value={listing.discountValue || ""}
                            type="number"
                            fullWidth
                            inputProps={{
                              min: 0,
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
        </div>

        <FormSpacer />
        {variant === "update" && (
          <>
            <RadioGroupField
              choices={voucherTypeChoices}
              disabled={disabled}
              error={!!formErrors.type}
              hint={getDiscountErrorMessage(formErrors.type, intl)}
              label={intl.formatMessage({
                id: "9UHfux",
                defaultMessage: "Voucher Specific Information",
              })}
              name={"type" as keyof VoucherDetailsPageFormData}
              value={data.type}
              onChange={onChange}
            />
          </>
        )}
        <FormSpacer />
        <ControlledCheckbox
          name={"applyOncePerOrder" as keyof VoucherDetailsPageFormData}
          label={
            <>
              <FormattedMessage
                id="Y3zr/B"
                defaultMessage="Apply only to a single cheapest eligible product"
                description="voucher application, switch button"
              />
              <Typography variant="caption">
                <FormattedMessage
                  id="ObRk1O"
                  defaultMessage="If this option is disabled, discount will be counted for every eligible product"
                />
              </Typography>
            </>
          }
          checked={data.applyOncePerOrder}
          onChange={onChange}
          disabled={disabled}
        />
      </CardContent>
    </Card>
  );
};
export default VoucherValue;
