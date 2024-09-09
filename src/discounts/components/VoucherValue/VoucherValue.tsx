// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { FormSpacer } from "@dashboard/components/FormSpacer";
import { NewRadioGroupField as RadioGroupField } from "@dashboard/components/RadioGroupField";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableHead from "@dashboard/components/TableHead";
import TableRowLink from "@dashboard/components/TableRowLink";
import { ChannelInput } from "@dashboard/discounts/handlers";
import { DiscountTypeEnum } from "@dashboard/discounts/types";
import { DiscountErrorFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { renderCollection } from "@dashboard/misc";
import { getFormErrors } from "@dashboard/utils/errors";
import getDiscountErrorMessage from "@dashboard/utils/errors/discounts";
import { TableBody, TableCell } from "@material-ui/core";
import { Box, Checkbox, Input, Skeleton, Text } from "@saleor/macaw-ui-next";
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
  onChange: FormChange;
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
    <DashboardCard data-test-id="value-section">
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "/oaqFS",
            defaultMessage: "Value",
            description: "section header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
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
                  <FormattedMessage id="1shOIS" defaultMessage="Price" description="column title" />
                </span>
              </TableCell>
            </TableHead>
            <TableBody>
              {renderCollection(
                data.channelListings,
                (listing, index) => {
                  const error = formErrors.discountValue?.channels?.find(id => id === listing.id);

                  return (
                    <TableRowLink
                      key={listing?.id || `skeleton-${index}`}
                      data-test-id={listing?.name}
                    >
                      <TableCell>
                        <Text>{listing?.name || <Skeleton />}</Text>
                      </TableCell>
                      <TableCell className={classes.colPrice}>
                        {listing ? (
                          <Input
                            data-test-id="discount-value-input"
                            disabled={disabled}
                            error={!!error?.length}
                            endAdornment={
                              <Text size={2}>
                                {data.discountType === DiscountTypeEnum.VALUE_FIXED
                                  ? listing.currency
                                  : "%"}
                              </Text>
                            }
                            helperText={
                              error ? getDiscountErrorMessage(formErrors.discountValue, intl) : ""
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
        </div>

        <FormSpacer />
        {variant === "update" && (
          <>
            <RadioGroupField
              choices={voucherTypeChoices}
              disabled={disabled}
              error={!!formErrors.type}
              errorMessage={getDiscountErrorMessage(formErrors.type, intl)}
              label={
                <Text marginBottom={2} display="block">
                  {intl.formatMessage({
                    id: "9UHfux",
                    defaultMessage: "Voucher Specific Information",
                  })}
                </Text>
              }
              name={"type" as keyof VoucherDetailsPageFormData}
              value={data.type}
              onChange={onChange}
            />
          </>
        )}
        <FormSpacer />
        <Checkbox
          name={"applyOncePerOrder" as keyof VoucherDetailsPageFormData}
          checked={data.applyOncePerOrder}
          onCheckedChange={value =>
            onChange({ target: { name: "applyOncePerOrder", value: value } })
          }
          disabled={disabled}
        >
          <Box display="flex" flexDirection="column">
            <Text>
              <FormattedMessage
                id="Y3zr/B"
                defaultMessage="Apply only to a single cheapest eligible product"
                description="voucher application, switch button"
              />
            </Text>
            <Text size={2} fontWeight="light" display="block" color="default2">
              <FormattedMessage
                id="ObRk1O"
                defaultMessage="If this option is disabled, discount will be counted for every eligible product"
              />
            </Text>
          </Box>
        </Checkbox>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export default VoucherValue;
