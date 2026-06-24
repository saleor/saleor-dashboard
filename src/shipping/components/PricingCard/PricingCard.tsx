// @ts-strict-ignore
import { type ChannelShippingData, sortChannelShippingDataByName } from "@dashboard/channels/utils";
import { DashboardCard } from "@dashboard/components/Card";
import PriceField from "@dashboard/components/PriceField";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import TableHead from "@dashboard/components/TableHead";
import TableRowLink from "@dashboard/components/TableRowLink";
import { type ShippingChannelsErrorFragment } from "@dashboard/graphql";
import { normalizeChannelPriceValue } from "@dashboard/shipping/utils/channelPricingState";
import { getFormChannelError, getFormChannelErrors } from "@dashboard/utils/errors";
import getShippingErrorMessage from "@dashboard/utils/errors/shipping";
import { TableBody, TableCell } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { useEffect, useMemo, useRef } from "react";
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
  /** When false, defers focusing until the page has finished loading (e.g. rich-text editor mounted). */
  isFocusReady?: boolean;
  onChange: (channelId: string, value: Value) => void;
}

const numberOfColumns = 2;

const PricingCard = ({
  channels,
  disabled,
  errors,
  focusChannelId,
  isFocusReady = true,
  onChange,
}: PricingCardProps) => {
  const classes = useStyles({});
  const intl = useIntl();
  const formErrors = getFormChannelErrors(["price"], errors);
  const sortedChannels = useMemo(() => sortChannelShippingDataByName(channels), [channels]);
  const focusInputRef = useRef<HTMLInputElement | null>(null);

  // useEffect (not useLayoutEffect) runs after child effects such as EditorJS
  // initialization, which would otherwise replace inputs and drop focus.
  useEffect(
    function focusChannelPriceInput() {
      if (!focusChannelId || !isFocusReady || disabled) {
        return;
      }

      const input = focusInputRef.current;

      if (!input || input.disabled) {
        return;
      }

      const frameId = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (!input.isConnected || input.disabled) {
            return;
          }

          input.closest("tr")?.scrollIntoView({ behavior: "auto", block: "center" });
          input.focus({ preventScroll: true });
        });
      });

      return () => {
        window.cancelAnimationFrame(frameId);
      };
    },
    [disabled, focusChannelId, isFocusReady, sortedChannels],
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
            {sortedChannels?.map(channel => {
              const error = getFormChannelError(formErrors.price, channel.id);
              const isFocusTarget = channel.id === focusChannelId;

              return (
                <TableRowLink key={channel.id} data-test-id={channel.name}>
                  <TableCell>
                    <Text>{channel.name}</Text>
                  </TableCell>
                  <TableCell className={shippingPriceTableStyles.shippingPriceTableInputCell}>
                    <PriceField
                      ref={isFocusTarget ? focusInputRef : undefined}
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
                          price: normalizeChannelPriceValue(e.target.value),
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
