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
import { applySpreadsheetPaste } from "@dashboard/utils/spreadsheetPaste/applySpreadsheetPaste";
import { Box, Text } from "@saleor/macaw-ui-next";
import { type ClipboardEvent, useCallback, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ShippingMethodChannelsEmptyPlaceholder } from "../ShippingMethodChannelsEmptyPlaceholder/ShippingMethodChannelsEmptyPlaceholder";
import styles from "./OrderValue.module.css";

interface Value {
  maxValue: string;
  minValue: string;
  price: string;
}

type OrderValuePasteField = "minValue" | "maxValue";

const ORDER_VALUE_PASTE_FIELDS: OrderValuePasteField[] = ["minValue", "maxValue"];

const getOrderValuePasteFields = (startField: OrderValuePasteField): OrderValuePasteField[] => {
  const startIndex = ORDER_VALUE_PASTE_FIELDS.indexOf(startField);

  return startIndex === -1 ? [] : ORDER_VALUE_PASTE_FIELDS.slice(startIndex);
};

interface OrderValueProps {
  channels: ChannelShippingData[];
  errors: ShippingChannelsErrorFragment[];
  disabled: boolean;
  onChannelChange: (channelId: string, value: Value) => void;
  onChannelsReplace: (channels: ChannelShippingData[]) => void;
}

export const OrderValue = ({
  channels,
  errors,
  disabled,
  onChannelChange,
  onChannelsReplace,
}: OrderValueProps): JSX.Element => {
  const intl = useIntl();
  const formErrors = getFormChannelErrors(
    ["maximumOrderPrice", "minimumOrderPrice"],
    errors as ChannelError[],
  );
  const sortedChannels = useMemo(() => sortChannelShippingDataByName(channels), [channels]);

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLElement>, startIndex: number, startField: OrderValuePasteField) => {
      const pastedText = event.clipboardData.getData("text/plain");

      if (pastedText === "") {
        return;
      }

      const { rows, handled } = applySpreadsheetPaste({
        rows: sortedChannels,
        startRowIndex: startIndex,
        fields: getOrderValuePasteFields(startField),
        pastedText,
        sanitize: (_field, cell, row) => sanitizeSpreadsheetPrice(cell, row.currency),
        setField: (row, field, value) => ({ ...row, [field]: value }),
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
    <DashboardCard data-test-id="order-value">
      <DashboardCard.Header>
        <Box display="flex" flexDirection="column">
          <DashboardCard.Title>
            {intl.formatMessage({
              id: "yatGsm",
              defaultMessage: "Order Value",
              description: "card title",
            })}
          </DashboardCard.Title>
          <DashboardCard.Subtitle fontSize={3} color="default2">
            <FormattedMessage
              id="AdOnH8"
              defaultMessage="Leave min and max empty to apply this rate to orders of any value."
              description="order value restrictions helper"
            />
          </DashboardCard.Subtitle>
        </Box>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {sortedChannels.length === 0 ? (
          <ShippingMethodChannelsEmptyPlaceholder />
        ) : (
          <Box className={styles.list} data-test-id="shipping-method-order-value-channel-list">
            <Text size={2} color="default2" className={styles.pasteHint}>
              <FormattedMessage
                id="mWTgxo"
                defaultMessage="You can paste from a spreadsheet. Select a field and paste tab-separated rows to fill min and max values down the list."
                description="shipping method order value spreadsheet paste hint"
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
                <FormattedMessage
                  id="0FexL7"
                  defaultMessage="Min. value"
                  description="min price in channel"
                />
              </Text>
              <Text size={2} color="default2">
                <FormattedMessage
                  id="ER/yBq"
                  defaultMessage="Max. value"
                  description="max price in channel"
                />
              </Text>
            </Box>
            {sortedChannels.map((channel, index) => {
              const minError = getFormChannelError(formErrors.minimumOrderPrice, channel.id);
              const maxError = getFormChannelError(formErrors.maximumOrderPrice, channel.id);

              return (
                <Box key={channel.id} className={styles.row} data-test-id={channel.name}>
                  <Text size={3} className={styles.channelName}>
                    {channel.name}
                  </Text>
                  <div
                    className={styles.inputCell}
                    onPasteCapture={event => handlePaste(event, index, "minValue")}
                  >
                    <PriceFieldV2
                      className={styles.amountInput}
                      data-test-id="min-value-price-input"
                      disabled={disabled}
                      error={!!minError}
                      helperText={minError ? getShippingErrorMessage(minError, intl) : undefined}
                      currencySymbol={channel.currency}
                      aria-label={intl.formatMessage(
                        {
                          id: "hub+oz",
                          defaultMessage: "Minimum order value for {channelName}",
                          description: "shipping method channel min order value aria label",
                        },
                        { channelName: channel.name },
                      )}
                      value={channel.minValue || ""}
                      onChange={value =>
                        onChannelChange(channel.id, {
                          ...channel,
                          minValue: value,
                        })
                      }
                    />
                  </div>
                  <div
                    className={styles.inputCell}
                    onPasteCapture={event => handlePaste(event, index, "maxValue")}
                  >
                    <PriceFieldV2
                      className={styles.amountInput}
                      data-test-id="max-value-price-input"
                      disabled={disabled}
                      error={!!maxError}
                      helperText={maxError ? getShippingErrorMessage(maxError, intl) : undefined}
                      currencySymbol={channel.currency}
                      aria-label={intl.formatMessage(
                        {
                          id: "LPkBO3",
                          defaultMessage: "Maximum order value for {channelName}",
                          description: "shipping method channel max order value aria label",
                        },
                        { channelName: channel.name },
                      )}
                      value={channel.maxValue || ""}
                      onChange={value =>
                        onChannelChange(channel.id, {
                          ...channel,
                          maxValue: value,
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

export default OrderValue;
