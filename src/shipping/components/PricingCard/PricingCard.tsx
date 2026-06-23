// @ts-strict-ignore
import { type ChannelShippingData } from "@dashboard/channels/utils";
import { DashboardCard } from "@dashboard/components/Card";
import PriceField from "@dashboard/components/PriceField";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import TableHead from "@dashboard/components/TableHead";
import TableRowLink from "@dashboard/components/TableRowLink";
import { type ShippingChannelsErrorFragment } from "@dashboard/graphql";
import { getFormChannelError, getFormChannelErrors } from "@dashboard/utils/errors";
import getShippingErrorMessage from "@dashboard/utils/errors/shipping";
import { TableBody, TableCell } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import shippingPriceTableStyles from "../ShippingPriceTable.module.css";
import { useStyles } from "./styles";

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
  onChange: (channelId: string, value: Value) => void;
  onFocusChannelHandled?: () => void;
}

const numberOfColumns = 2;
const FOCUS_RETRY_INTERVAL_MS = 100;
const FOCUS_RETRY_TIMEOUT_MS = 5000;

const PricingCard = ({
  channels,
  disabled,
  errors,
  focusChannelId,
  onChange,
  onFocusChannelHandled,
}: PricingCardProps) => {
  const classes = useStyles({});
  const intl = useIntl();
  const formErrors = getFormChannelErrors(["price"], errors);
  const focusInputRef = useRef<HTMLInputElement | null>(null);
  const handledFocusChannelId = useRef<string | undefined>();

  useEffect(
    function focusChannelPriceInput() {
      if (!focusChannelId || handledFocusChannelId.current === focusChannelId) {
        return;
      }

      let intervalId: number;
      let timeoutId: number;

      const tryFocus = () => {
        const priceInput = focusInputRef.current;

        if (!priceInput || disabled || priceInput.disabled) {
          return false;
        }

        priceInput.closest("tr")?.scrollIntoView({ behavior: "auto", block: "center" });
        priceInput.focus({ preventScroll: true });

        return document.activeElement === priceInput;
      };

      const completeFocus = () => {
        handledFocusChannelId.current = focusChannelId;
        onFocusChannelHandled?.();
      };

      if (tryFocus()) {
        completeFocus();

        return;
      }

      intervalId = window.setInterval(() => {
        if (tryFocus()) {
          window.clearInterval(intervalId);
          completeFocus();
        }
      }, FOCUS_RETRY_INTERVAL_MS);

      timeoutId = window.setTimeout(() => window.clearInterval(intervalId), FOCUS_RETRY_TIMEOUT_MS);

      return () => {
        window.clearInterval(intervalId);
        window.clearTimeout(timeoutId);
      };
    },
    [channels, disabled, focusChannelId, onFocusChannelHandled],
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
      <DashboardCard.Content className={classes.pricingContent}>
        <ResponsiveTable
          className={clsx(classes.table, shippingPriceTableStyles.shippingPriceTable)}
        >
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
            {channels?.map(channel => {
              const error = getFormChannelError(formErrors.price, channel.id);
              const shouldFocusChannel = channel.id === focusChannelId;

              return (
                <TableRowLink
                  key={channel.id}
                  data-test-id={channel.name}
                  data-pricing-channel-id={channel.id}
                >
                  <TableCell>
                    <Text>{channel.name}</Text>
                  </TableCell>
                  <TableCell>
                    <PriceField
                      ref={shouldFocusChannel ? focusInputRef : undefined}
                      data-test-id="price-input"
                      disabled={disabled}
                      error={!!error}
                      label={intl.formatMessage({
                        id: "1shOIS",
                        defaultMessage: "Price",
                        description: "column title",
                      })}
                      name="price"
                      value={channel.price}
                      onChange={e =>
                        onChange(channel.id, {
                          ...channel,
                          price: e.target.value,
                        })
                      }
                      currencySymbol={channel.currency}
                      required
                      hint={error && getShippingErrorMessage(error, intl)}
                    />
                  </TableCell>
                </TableRowLink>
              );
            })}
          </TableBody>
        </ResponsiveTable>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export default PricingCard;
