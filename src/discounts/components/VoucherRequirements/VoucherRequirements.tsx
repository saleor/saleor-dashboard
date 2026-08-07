import { type ChannelVoucherData } from "@dashboard/channels/utils";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import {
  DetailSettingNestedField,
  DetailSettingToggleRow,
} from "@dashboard/components/DetailSettingToggleRow/DetailSettingToggleRow";
import { Placeholder } from "@dashboard/components/Placeholder";
import { PriceFieldV2 } from "@dashboard/components/PriceFieldV2/PriceFieldV2";
import { sanitizeSpreadsheetPrice } from "@dashboard/components/PriceFieldV2/utils";
import { type ChannelInput } from "@dashboard/discounts/handlers";
import { RequirementsPicker } from "@dashboard/discounts/types";
import { type DiscountErrorFragment } from "@dashboard/graphql";
import { renderCollection } from "@dashboard/misc";
import { getFormErrors } from "@dashboard/utils/errors";
import getDiscountErrorMessage from "@dashboard/utils/errors/discounts";
import { applySpreadsheetColumnPaste } from "@dashboard/utils/spreadsheetPaste/applySpreadsheetColumnPaste";
import { Box, Input, Skeleton, Text } from "@saleor/macaw-ui-next";
import { type ChangeEvent, type ClipboardEvent, useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { type VoucherDetailsPageFormData } from "../VoucherDetailsPage";
import styles from "./VoucherRequirements.module.css";

interface VoucherRequirementsProps {
  data: VoucherDetailsPageFormData;
  disabled: boolean;
  loading?: boolean;
  errors: DiscountErrorFragment[];
  onChange: (event: ChangeEvent<any>) => void;
  onChannelChange: (channelId: string, input: ChannelInput) => void;
  onChannelsChange: (channels: ChannelVoucherData[]) => void;
}

export const VoucherRequirements = ({
  data,
  disabled,
  loading = false,
  errors,
  onChange,
  onChannelChange,
  onChannelsChange,
}: VoucherRequirementsProps): JSX.Element => {
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
  const minQuantityValue = Number(data.minCheckoutItemsQuantity);
  const hasInvalidMinQuantity =
    data.requirementsPicker === RequirementsPicker.ITEM &&
    (!Number.isFinite(minQuantityValue) || minQuantityValue < 1);
  const minQuantityHelperText = formErrors.minCheckoutItemsQuantity
    ? getDiscountErrorMessage(formErrors.minCheckoutItemsQuantity, intl)
    : hasInvalidMinQuantity
      ? intl.formatMessage({
          id: "Flraxf",
          defaultMessage: "Enter at least 1 item.",
          description: "voucher minimum quantity validation error",
        })
      : intl.formatMessage({
          id: "S0ntb5",
          defaultMessage: "Must be 1 or more. Zero has no effect — turn this setting off instead.",
          description: "voucher minimum quantity zero behavior hint",
        });

  const setRequirementsPicker = (picker: RequirementsPicker): void => {
    onChange({
      target: {
        name: "requirementsPicker",
        value: picker,
      },
    } as ChangeEvent<any>);
  };

  const setMinCheckoutItemsQuantity = (value: string): void => {
    onChange({
      target: {
        name: "minCheckoutItemsQuantity",
        value,
      },
    } as ChangeEvent<any>);
  };

  const handleMinSpentPaste = useCallback(
    (event: ClipboardEvent<HTMLElement>, startIndex: number) => {
      const pastedText = event.clipboardData.getData("text/plain");

      if (pastedText === "" || !data.channelListings) {
        return;
      }

      const { rows, handled } = applySpreadsheetColumnPaste({
        rows: data.channelListings,
        startIndex,
        pastedText,
        sanitizeCell: (cell, row) => sanitizeSpreadsheetPrice(cell, row.currency),
        setCell: (row, value) => ({ ...row, minSpent: value }),
      });

      if (!handled) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      onChannelsChange(rows);
    },
    [data.channelListings, onChannelsChange],
  );

  return (
    <DetailSettingsCard
      data-test-id="minimum-requirements-section"
      title={intl.formatMessage({
        id: "yhv3HX",
        defaultMessage: "Minimum Requirements",
        description: "voucher requirements, header",
      })}
      intro={
        <Text size={3} color="default2">
          <FormattedMessage
            id="CQS9eE"
            defaultMessage="Optional thresholds customers must meet before the voucher can be applied."
            description="voucher requirements section intro"
          />
        </Text>
      }
      contentFlush
    >
      {loading ? (
        <Box
          display="flex"
          flexDirection="column"
          gap={1}
          paddingX={6}
          paddingY={4}
          data-test-id="minimum-requirements-section-skeleton"
        >
          <Skeleton __height="3.5rem" />
          <Skeleton __height="3.5rem" />
        </Box>
      ) : (
        <>
          <DetailSettingToggleRow
            title={minimalOrderValueText}
            description={
              <FormattedMessage
                id="RGL8Oi"
                defaultMessage="Checkout subtotal in each channel's currency must meet this amount."
                description="voucher minimum order requirement description"
              />
            }
            pressed={data.requirementsPicker === RequirementsPicker.ORDER}
            onPressedChange={pressed => {
              if (pressed) {
                setRequirementsPicker(RequirementsPicker.ORDER);
              } else if (data.requirementsPicker === RequirementsPicker.ORDER) {
                setRequirementsPicker(RequirementsPicker.NONE);
              }
            }}
            disabled={disabled}
          >
            {data.requirementsPicker === RequirementsPicker.ORDER ? (
              <DetailSettingNestedField>
                {data.channelListings?.length === 0 ? (
                  <Placeholder>
                    <FormattedMessage id="/glQgs" defaultMessage="No channels found" />
                  </Placeholder>
                ) : (
                  <Box className={styles.list} data-test-id="voucher-min-order-channel-list">
                    <Text size={2} color="default2" className={styles.pasteHint}>
                      <FormattedMessage
                        id="oVM/qc"
                        defaultMessage="You can paste from a spreadsheet. Select a field and paste a column of values to fill amounts down the list."
                        description="voucher minimum order value spreadsheet paste hint"
                      />
                    </Text>
                    {renderCollection(data.channelListings, (listing, index) => {
                      const channelError = formErrors.minSpent?.channels?.find(
                        id => id === listing?.id,
                      );

                      return (
                        <Box
                          key={listing?.id || `skeleton-${index}`}
                          className={styles.row}
                          data-test-id={listing?.name}
                        >
                          <Text size={3} className={styles.channelName}>
                            {listing?.name || <Skeleton />}
                          </Text>
                          {listing ? (
                            <div
                              className={styles.inputCell}
                              onPasteCapture={event => handleMinSpentPaste(event, index ?? 0)}
                            >
                              <PriceFieldV2
                                className={styles.amountInput}
                                data-test-id="min-spent-input"
                                disabled={disabled}
                                error={!!channelError?.length}
                                helperText={
                                  channelError
                                    ? getDiscountErrorMessage(formErrors.minSpent, intl)
                                    : ""
                                }
                                currencySymbol={listing.currency}
                                aria-label={intl.formatMessage(
                                  {
                                    id: "6wQfpJ",
                                    defaultMessage: "Minimal order value for {channelName}",
                                    description:
                                      "voucher minimum order value channel input aria label",
                                  },
                                  { channelName: listing.name },
                                )}
                                value={listing.minSpent || ""}
                                size="small"
                                onChange={value =>
                                  onChannelChange(listing.id, {
                                    minSpent: value,
                                  })
                                }
                              />
                            </div>
                          ) : (
                            <Skeleton __width="6rem" />
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </DetailSettingNestedField>
            ) : null}
          </DetailSettingToggleRow>

          <DetailSettingToggleRow
            title={minimalQuantityText}
            description={
              <FormattedMessage
                id="Y32ij8"
                defaultMessage="Total quantity of eligible items in checkout must be at least this number."
                description="voucher minimum quantity requirement description"
              />
            }
            pressed={data.requirementsPicker === RequirementsPicker.ITEM}
            onPressedChange={pressed => {
              if (pressed) {
                setRequirementsPicker(RequirementsPicker.ITEM);

                if (!Number.isFinite(minQuantityValue) || minQuantityValue < 1) {
                  setMinCheckoutItemsQuantity("1");
                }
              } else if (data.requirementsPicker === RequirementsPicker.ITEM) {
                setRequirementsPicker(RequirementsPicker.NONE);
              }
            }}
            disabled={disabled}
          >
            {data.requirementsPicker === RequirementsPicker.ITEM ? (
              <DetailSettingNestedField>
                <Input
                  data-test-id="minimum-quantity-of-items-input"
                  disabled={disabled}
                  error={!!formErrors.minCheckoutItemsQuantity || hasInvalidMinQuantity}
                  helperText={minQuantityHelperText}
                  label={minimalQuantityText}
                  name={"minCheckoutItemsQuantity" as keyof VoucherDetailsPageFormData}
                  value={data.minCheckoutItemsQuantity}
                  onChange={onChange}
                  type="number"
                  min={1}
                  step={1}
                />
              </DetailSettingNestedField>
            ) : null}
          </DetailSettingToggleRow>
        </>
      )}
    </DetailSettingsCard>
  );
};
