import {
  Card,
  CardContent,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { FormSpacer } from "@saleor/components/FormSpacer";
import PriceField from "@saleor/components/PriceField";
import RadioGroupField from "@saleor/components/RadioGroupField";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableHead from "@saleor/components/TableHead";
import { ChannelInput } from "@saleor/discounts/handlers";
import { RequirementsPicker } from "@saleor/discounts/types";
import { DiscountErrorFragment } from "@saleor/graphql";
import { renderCollection } from "@saleor/misc";
import { getFormErrors } from "@saleor/utils/errors";
import getDiscountErrorMessage from "@saleor/utils/errors/discounts";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { VoucherDetailsPageFormData } from "../VoucherDetailsPage";
import { useStyles } from "./styles";

interface VoucherRequirementsProps {
  data: VoucherDetailsPageFormData;
  disabled: boolean;
  errors: DiscountErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
  onChannelChange: (channelId: string, input: ChannelInput) => void;
}

const numberOfColumns = 2;

const VoucherRequirements = ({
  data,
  disabled,
  errors,
  onChange,
  onChannelChange,
}: VoucherRequirementsProps) => {
  const classes = useStyles({});
  const intl = useIntl();

  const formErrors = getFormErrors(
    ["minSpent", "minCheckoutItemsQuantity"],
    errors,
  );
  const minimalOrderValueText = intl.formatMessage({
    id: "bh9+8A",
    defaultMessage: "Minimal order value",
    description: "voucher requirement",
  });
  const minimalQuantityText = intl.formatMessage({
    id: "XT/ZvF",
    defaultMessage: "Minimum quantity of items",
    description: "voucher requirement",
  });

  const requirementsPickerChoices = [
    {
      label: intl.formatMessage({
        id: "u/hkKO",
        defaultMessage: "None",
        description: "voucher has no requirements",
      }),
      value: RequirementsPicker.NONE,
    },
    {
      label: minimalOrderValueText,
      value: RequirementsPicker.ORDER,
    },
    {
      label: minimalQuantityText,
      value: RequirementsPicker.ITEM,
    },
  ];

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "yhv3HX",
          defaultMessage: "Minimum Requirements",
          description: "voucher requirements, header",
        })}
      />
      <CardContent>
        <RadioGroupField
          choices={requirementsPickerChoices}
          disabled={disabled}
          name={"requirementsPicker" as keyof VoucherDetailsPageFormData}
          value={data.requirementsPicker}
          onChange={onChange}
        />
        {[RequirementsPicker.ORDER, RequirementsPicker.ITEM].includes(
          data.requirementsPicker,
        ) && <FormSpacer />}
        {data.requirementsPicker === RequirementsPicker.ORDER ? (
          <>
            <Typography variant="caption">
              <FormattedMessage
                id="K+ROF8"
                defaultMessage="Channels that don’t have assigned discounts will use their parent channel to define the price. Price will be converted to channel’s currency"
              />
            </Typography>
            <div className={classes.tableContainer}>
              <ResponsiveTable className={classes.table}>
                <TableHead
                  colSpan={numberOfColumns}
                  disabled={disabled}
                  items={[]}
                >
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
                        id="GVinbz"
                        defaultMessage="Value"
                        description="column title"
                      />
                    </span>
                  </TableCell>
                </TableHead>
                <TableBody>
                  {renderCollection(
                    data.channelListings,
                    (listing, index) => {
                      const error = formErrors.minSpent?.channels?.find(
                        id => id === listing.id,
                      );
                      return (
                        <TableRow key={listing?.id || `skeleton-${index}`}>
                          <TableCell>
                            <Typography>
                              {listing?.name || <Skeleton />}
                            </Typography>
                          </TableCell>
                          <TableCell className={classes.colPrice}>
                            {listing ? (
                              <PriceField
                                disabled={disabled}
                                error={!!error?.length}
                                hint={
                                  error
                                    ? getDiscountErrorMessage(
                                        formErrors.minSpent,
                                        intl,
                                      )
                                    : ""
                                }
                                label={minimalOrderValueText}
                                name="minSpent"
                                value={listing.minSpent || ""}
                                onChange={e =>
                                  onChannelChange(listing.id, {
                                    minSpent: e.target.value,
                                  })
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
            </div>
          </>
        ) : data.requirementsPicker === RequirementsPicker.ITEM ? (
          <TextField
            disabled={disabled}
            error={!!formErrors.minCheckoutItemsQuantity}
            helperText={getDiscountErrorMessage(
              formErrors.minCheckoutItemsQuantity,
              intl,
            )}
            label={minimalQuantityText}
            name={
              "minCheckoutItemsQuantity" as keyof VoucherDetailsPageFormData
            }
            value={data.minCheckoutItemsQuantity}
            onChange={onChange}
            fullWidth
          />
        ) : null}
      </CardContent>
    </Card>
  );
};
export default VoucherRequirements;
