import { type ChannelShippingData, sortChannelShippingDataByName } from "@dashboard/channels/utils";
import { DashboardCard } from "@dashboard/components/Card";
import { PriceFieldV2 } from "@dashboard/components/PriceFieldV2/PriceFieldV2";
import { sanitizeSpreadsheetPrice } from "@dashboard/components/PriceFieldV2/utils";
import { type ShippingChannelsErrorFragment } from "@dashboard/graphql";
import {
  type ChannelError,
  getFormChannelError,
  getFormChannelErrors,
} from "@dashboard/utils/errors";
import getShippingErrorMessage from "@dashboard/utils/errors/shipping";
import { applySpreadsheetColumnPaste } from "@dashboard/utils/spreadsheetPaste/applySpreadsheetColumnPaste";
import { Box, Text } from "@saleor/macaw-ui-next";
import { type ClipboardEvent, useCallback, useEffect, useMemo, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ShippingMethodChannelsEmptyPlaceholder } from "../ShippingMethodChannelsEmptyPlaceholder/ShippingMethodChannelsEmptyPlaceholder";
import { shippingZoneMethodsMessages } from "../ShippingZoneRates/messages";
import styles from "./PricingCard.module.css";

interface Value {
  maxValue: string;
  minValue: string;
  price: string;
}

interface PricingCardProps {
  channels: ChannelShippingData[];
  errors: ShippingChannelsErrorFragment[];
  disabled: boolean;
  focusChannelId?: string;
  /** When false, defers focusing until the page has finished loading (e.g. rich-text editor mounted). */
  isFocusReady?: boolean;
  /** Called once after the deep-linked price input is focused (clear `channelId` from the URL). */
  onFocusChannelComplete?: () => void;
  onChange: (channelId: string, value: Value) => void;
  onChannelsReplace: (channels: ChannelShippingData[]) => void;
}

export const PricingCard = ({
  channels,
  disabled,
  errors,
  focusChannelId,
  isFocusReady = true,
  onFocusChannelComplete,
  onChange,
  onChannelsReplace,
}: PricingCardProps): JSX.Element => {
  const intl = useIntl();
  const formErrors = getFormChannelErrors(["price"], errors as ChannelError[]);
  const sortedChannels = useMemo(() => sortChannelShippingDataByName(channels), [channels]);
  const focusRowRef = useRef<HTMLDivElement | null>(null);
  const focusedChannelIdRef = useRef<string | null>(null);

  useEffect(
    function resetFocusTrackingWhenChannelCleared() {
      if (!focusChannelId) {
        focusedChannelIdRef.current = null;
      }
    },
    [focusChannelId],
  );

  useEffect(
    function focusChannelPriceInputOnce() {
      if (!focusChannelId || !isFocusReady || disabled) {
        return;
      }

      // Channel edits remount/reorder rows and must not steal focus back.
      if (focusedChannelIdRef.current === focusChannelId) {
        return;
      }

      const input = focusRowRef.current?.querySelector("input");

      if (!input || input.disabled) {
        return;
      }

      const frameId = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (!input.isConnected || input.disabled) {
            return;
          }

          input.scrollIntoView({ behavior: "auto", block: "center" });
          input.focus({ preventScroll: true });
          focusedChannelIdRef.current = focusChannelId;
          onFocusChannelComplete?.();
        });
      });

      return () => {
        window.cancelAnimationFrame(frameId);
      };
    },
    [disabled, focusChannelId, isFocusReady, onFocusChannelComplete, sortedChannels],
  );

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLElement>, startIndex: number) => {
      const pastedText = event.clipboardData.getData("text/plain");

      if (pastedText === "") {
        return;
      }

      const { rows, handled } = applySpreadsheetColumnPaste({
        rows: sortedChannels,
        startIndex,
        pastedText,
        sanitizeCell: (cell, row) => sanitizeSpreadsheetPrice(cell, row.currency),
        setCell: (row, value) => ({ ...row, price: value }),
      });

      if (!handled) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      onChannelsReplace(rows);
    },
    [onChannelsReplace, sortedChannels],
  );

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "TnTi/a",
            defaultMessage: "Pricing",
            description: "pricing card title",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {sortedChannels.length === 0 ? (
          <ShippingMethodChannelsEmptyPlaceholder />
        ) : (
          <Box className={styles.list} data-test-id="shipping-method-pricing-channel-list">
            <Text size={2} color="default2" className={styles.pasteHint}>
              <FormattedMessage
                id="oVM/qc"
                defaultMessage="You can paste from a spreadsheet. Select a field and paste a column of values to fill amounts down the list."
                description="voucher minimum order value spreadsheet paste hint"
              />
            </Text>
            <Box className={styles.headerRow}>
              <Text size={2} color="default2">
                <FormattedMessage
                  id="UymotP"
                  defaultMessage="Channel name"
                  description="channel name"
                />
              </Text>
              <Text size={2} color="default2">
                <FormattedMessage {...shippingZoneMethodsMessages.priceColumn} />
              </Text>
            </Box>
            {sortedChannels.map((channel, index) => {
              const error = getFormChannelError(formErrors.price, channel.id);
              const isFocusTarget = channel.id === focusChannelId;

              return (
                <Box
                  key={channel.id}
                  ref={isFocusTarget ? focusRowRef : undefined}
                  className={styles.row}
                  data-test-id={channel.name}
                >
                  <Text size={3} className={styles.channelName}>
                    {channel.name}
                  </Text>
                  <div
                    className={styles.inputCell}
                    onPasteCapture={event => handlePaste(event, index)}
                  >
                    <PriceFieldV2
                      className={styles.amountInput}
                      data-test-id="price-input"
                      disabled={disabled}
                      error={!!error}
                      helperText={error ? getShippingErrorMessage(error, intl) : undefined}
                      currencySymbol={channel.currency}
                      aria-label={intl.formatMessage(
                        {
                          id: "sC3g5c",
                          defaultMessage: "Price for {channelName}",
                          description: "shipping method channel price input aria label",
                        },
                        { channelName: channel.name },
                      )}
                      value={channel.price || ""}
                      onChange={value =>
                        onChange(channel.id, {
                          ...channel,
                          price: value,
                        })
                      }
                    />
                  </div>
                </Box>
              );
            })}
          </Box>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export default PricingCard;
