import { type ChannelVoucherData } from "@dashboard/channels/utils";
import { PriceFieldV2 } from "@dashboard/components/PriceFieldV2/PriceFieldV2";
import { sanitizeSpreadsheetPrice } from "@dashboard/components/PriceFieldV2/utils";
import { type DiscountErrorFragment } from "@dashboard/graphql";
import { renderCollection } from "@dashboard/misc";
import { getFormErrors } from "@dashboard/utils/errors";
import getDiscountErrorMessage from "@dashboard/utils/errors/discounts";
import { applySpreadsheetColumnPaste } from "@dashboard/utils/spreadsheetPaste/applySpreadsheetColumnPaste";
import { Box, Input, Skeleton, Text } from "@saleor/macaw-ui-next";
import { type ClipboardEvent, useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { type ChannelInput } from "../../handlers";
import { voucherDiscountSectionMessages as messages } from "./messages";
import styles from "./VoucherFixedAmountChannelList.module.css";

type ChannelDiscountAmountKind = "fixed" | "percentage";

interface VoucherFixedAmountChannelListProps {
  channelListings: ChannelVoucherData[];
  disabled?: boolean;
  errors: DiscountErrorFragment[];
  /** Fixed = currency amount; percentage = independent % per channel. */
  amountKind?: ChannelDiscountAmountKind;
  onChannelChange: (channelId: string, input: ChannelInput) => void;
  onChannelsChange: (channels: ChannelVoucherData[]) => void;
}

const sanitizePercentageCell = (cell: string): string => {
  const trimmed = cell.trim().replace(/%/g, "");

  if (trimmed === "") {
    return "";
  }

  const normalized = trimmed.replace(",", ".");
  const value = Number(normalized);

  if (!Number.isFinite(value)) {
    return "";
  }

  return String(value);
};

export const VoucherFixedAmountChannelList = ({
  channelListings,
  disabled,
  errors,
  amountKind = "fixed",
  onChannelChange,
  onChannelsChange,
}: VoucherFixedAmountChannelListProps): JSX.Element => {
  const intl = useIntl();
  const formErrors = getFormErrors(["discountValue"], errors);
  const isPercentage = amountKind === "percentage";

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLElement>, startIndex: number) => {
      const pastedText = event.clipboardData.getData("text/plain");

      if (pastedText === "") {
        return;
      }

      const { rows, handled } = applySpreadsheetColumnPaste({
        rows: channelListings,
        startIndex,
        pastedText,
        sanitizeCell: (cell, row) =>
          isPercentage
            ? sanitizePercentageCell(cell)
            : sanitizeSpreadsheetPrice(cell, row.currency),
        setCell: (row, value) =>
          isPercentage
            ? { ...row, percentageDiscountValue: value }
            : { ...row, discountValue: value },
      });

      if (!handled) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      onChannelsChange(rows);
    },
    [channelListings, isPercentage, onChannelsChange],
  );

  return (
    <Box
      className={styles.list}
      data-test-id={
        isPercentage ? "voucher-percentage-channel-list" : "voucher-fixed-amount-channel-list"
      }
    >
      <Text size={2} color="default2" className={styles.pasteHint}>
        <FormattedMessage
          {...(isPercentage ? messages.percentagePasteHint : messages.fixedAmountPasteHint)}
        />
      </Text>
      {renderCollection(channelListings, (listing, index) => {
        const channelError = formErrors.discountValue?.channels?.find(id => id === listing?.id);

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
                onPasteCapture={event => handlePaste(event, index ?? 0)}
              >
                {isPercentage ? (
                  <Input
                    className={styles.amountInput}
                    data-test-id="discount-value-input"
                    disabled={disabled}
                    error={!!channelError?.length}
                    endAdornment={<Text size={2}>%</Text>}
                    helperText={
                      channelError ? getDiscountErrorMessage(formErrors.discountValue, intl) : ""
                    }
                    aria-label={intl.formatMessage(
                      {
                        id: "MKTuIa",
                        defaultMessage: "Percentage for {channelName}",
                        description: "voucher percentage channel input aria label",
                      },
                      { channelName: listing.name },
                    )}
                    name={`percentageDiscountValue.${listing.id}`}
                    type="number"
                    size="small"
                    value={listing.percentageDiscountValue || ""}
                    onChange={event =>
                      onChannelChange(listing.id, {
                        percentageDiscountValue: event.target.value,
                      })
                    }
                  />
                ) : (
                  <PriceFieldV2
                    className={styles.amountInput}
                    data-test-id="discount-value-input"
                    disabled={disabled}
                    error={!!channelError?.length}
                    helperText={
                      channelError ? getDiscountErrorMessage(formErrors.discountValue, intl) : ""
                    }
                    currencySymbol={listing.currency}
                    aria-label={intl.formatMessage(
                      {
                        id: "JufrQR",
                        defaultMessage: "Fixed amount for {channelName}",
                        description: "voucher fixed amount channel input aria label",
                      },
                      { channelName: listing.name },
                    )}
                    value={listing.discountValue || ""}
                    size="small"
                    onChange={value =>
                      onChannelChange(listing.id, {
                        discountValue: value,
                      })
                    }
                  />
                )}
              </div>
            ) : (
              <Skeleton __width="6rem" />
            )}
          </Box>
        );
      })}
    </Box>
  );
};
