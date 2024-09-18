// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { FormSpacer } from "@dashboard/components/FormSpacer";
import PriceField from "@dashboard/components/PriceField";
import { NewRadioGroupField as RadioGroupField } from "@dashboard/components/RadioGroupField";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableHead from "@dashboard/components/TableHead";
import TableRowLink from "@dashboard/components/TableRowLink";
import { ChannelInput } from "@dashboard/discounts/handlers";
import { RequirementsPicker } from "@dashboard/discounts/types";
import { DiscountErrorFragment } from "@dashboard/graphql";
import { renderCollection } from "@dashboard/misc";
import { getFormErrors } from "@dashboard/utils/errors";
import getDiscountErrorMessage from "@dashboard/utils/errors/discounts";
import { TableBody, TableCell } from "@material-ui/core";
import { Input, Skeleton, Text } from "@saleor/macaw-ui-next";
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
  const formErrors = getFormErrors(["minSpent", "minCheckoutItemsQuantity"], errors);
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
    <DashboardCard data-test-id="minimum-requirements-section">
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "yhv3HX",
            defaultMessage: "Minimum Requirements",
            description: "voucher requirements, header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <RadioGroupField
          choices={requirementsPickerChoices}
          disabled={disabled}
          name={"requirementsPicker" as keyof VoucherDetailsPageFormData}
          value={data.requirementsPicker}
          onChange={onChange}
        />
        {[RequirementsPicker.ORDER, RequirementsPicker.ITEM].includes(data.requirementsPicker) && (
          <FormSpacer />
        )}
        {data.requirementsPicker === RequirementsPicker.ORDER ? (
          <>
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
                      const error = formErrors.minSpent?.channels?.find(id => id === listing.id);

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
                              <PriceField
                                disabled={disabled}
                                error={!!error?.length}
                                hint={
                                  error ? getDiscountErrorMessage(formErrors.minSpent, intl) : ""
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
          </>
        ) : data.requirementsPicker === RequirementsPicker.ITEM ? (
          <Input
            data-test-id="minimum-quantity-of-items-input"
            disabled={disabled}
            error={!!formErrors.minCheckoutItemsQuantity}
            helperText={getDiscountErrorMessage(formErrors.minCheckoutItemsQuantity, intl)}
            label={minimalQuantityText}
            name={"minCheckoutItemsQuantity" as keyof VoucherDetailsPageFormData}
            value={data.minCheckoutItemsQuantity}
            onChange={onChange}
            width="100%"
          />
        ) : null}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export default VoucherRequirements;
