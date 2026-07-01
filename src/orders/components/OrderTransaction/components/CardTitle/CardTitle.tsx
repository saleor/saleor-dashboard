import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { Title2 } from "@dashboard/components/Title2/Title2";
import { TransactionActionEnum } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Dropdown, List, Text } from "@saleor/macaw-ui-next";
import { ExternalLink, MoreVertical } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import { type OrderTransactionProps } from "../../OrderTransaction";
import { transactionActionInFlight } from "../../transactionInFlight";
import { type ExtendedOrderTransaction } from "../../types";
import { mapActionToInProgressMessage, mapActionToMessage } from "../../utils";
import { PaymentMethodDetails } from "../PaymentMethodDetails";
import { EventTime } from "../TransactionEvents/components/EventTime";
import { messages } from "./messages";
import { MoneyDisplay } from "./MoneyDisplay";

const isDestructiveAction = (action: TransactionActionEnum) =>
  action === TransactionActionEnum.CANCEL || action === TransactionActionEnum.REFUND;

const isPrimaryAction = (action: TransactionActionEnum) => action === TransactionActionEnum.CHARGE;

const getTransactionAmounts = ({
  chargedAmount,
  authorizedAmount,
  refundedAmount,
  canceledAmount,
  chargePendingAmount,
  authorizePendingAmount,
  refundPendingAmount,
  cancelPendingAmount,
}: ExtendedOrderTransaction) =>
  [
    { label: messages.charged, money: chargedAmount, show: chargedAmount.amount > 0 },
    { label: messages.authorized, money: authorizedAmount, show: authorizedAmount.amount > 0 },
    { label: messages.refunded, money: refundedAmount, show: refundedAmount.amount > 0 },
    { label: messages.canceled, money: canceledAmount, show: canceledAmount.amount > 0 },
    {
      label: messages.chargePending,
      money: chargePendingAmount,
      show: chargePendingAmount.amount > 0,
    },
    {
      label: messages.authorizePending,
      money: authorizePendingAmount,
      show: authorizePendingAmount.amount > 0,
    },
    {
      label: messages.refundPending,
      money: refundPendingAmount,
      show: refundPendingAmount.amount > 0,
    },
    {
      label: messages.cancelPending,
      money: cancelPendingAmount,
      show: cancelPendingAmount.amount > 0,
    },
  ].filter(item => item.show);

interface CardTitleProps {
  transaction: ExtendedOrderTransaction;
  onTransactionAction: OrderTransactionProps["onTransactionAction"];
  showActions?: boolean;
  chevron?: React.ReactNode;
}

const TransactionTitle = ({
  transaction,
  index,
  chevron,
}: {
  transaction: ExtendedOrderTransaction;
  index: number;
  chevron?: React.ReactNode;
}) => {
  const intl = useIntl();

  const transactionTitle = intl.formatMessage(
    {
      defaultMessage: "Transaction #{index} on {date}",
      id: "nYD7NT",
    },
    {
      date: <EventTime date={transaction.createdAt} />,
      index: index + 1,
    },
  );

  return (
    <Box display="flex" flexDirection="column" gap={0.5}>
      <Box display="flex" alignItems="center" gap={2}>
        {chevron}
        <Title2>{transactionTitle}</Title2>
        {transaction.externalUrl && (
          <Box
            as="a"
            href={transaction.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            display="flex"
            alignItems="center"
            onClick={e => e.stopPropagation()}
            color={{ default: "default2", hover: "default1" }}
            __transition="color 0.15s ease-in-out"
            title={intl.formatMessage({
              defaultMessage: "View in payment provider",
              id: "ce2kVF",
            })}
          >
            <ExternalLink size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
          </Box>
        )}
      </Box>
      {transaction.name && (
        <Text size={2} color="default2" fontWeight="medium">
          {transaction.name}
        </Text>
      )}
    </Box>
  );
};

export const OrderTransactionCardTitle = ({
  transaction,
  onTransactionAction,
  showActions = true,
  chevron,
}: CardTitleProps) => {
  const intl = useIntl();

  const { index = 0 } = transaction;

  // Fake (optimistic) transactions have no real events, so nothing is ever in flight.
  const transactionEvents = "events" in transaction ? transaction.events : undefined;

  const availableActions = transaction.actions.filter(
    action => action !== TransactionActionEnum.REFUND,
  );
  // Primary actions (like Capture) are shown as visible buttons
  const primaryActions = availableActions.filter(isPrimaryAction);
  // Secondary/destructive actions (like Cancel) go into the menu
  const menuActions = availableActions.filter(action => !isPrimaryAction(action));

  const showPrimaryActions = showActions && primaryActions.length > 0;
  const showActionsMenu = showActions && menuActions.length > 0;

  // Collect all non-zero amounts for display
  const amounts = getTransactionAmounts(transaction);

  return (
    <Box width="100%" display="flex" justifyContent="space-between" alignItems="center" gap={4}>
      <TransactionTitle transaction={transaction} index={index} chevron={chevron} />

      <Box display="flex" gap={4} alignItems="center">
        {transaction.paymentMethodDetails && (
          <Box
            borderRightStyle="solid"
            borderColor="default1"
            borderRightWidth={1}
            paddingRight={4}
          >
            <PaymentMethodDetails paymentMethodDetails={transaction.paymentMethodDetails} />
          </Box>
        )}

        {amounts.map(({ label, money }) => (
          <MoneyDisplay key={label.id} label={intl.formatMessage(label)} money={money} />
        ))}

        {(showPrimaryActions || showActionsMenu) && (
          <Box display="flex" gap={2} alignItems="center">
            {showPrimaryActions &&
              primaryActions.map(action => {
                const inFlight = transactionActionInFlight(transactionEvents, action);

                return (
                  <Button
                    key={`transaction-primary-action-${action}`}
                    variant="secondary"
                    disabled={inFlight}
                    onClick={e => {
                      e.stopPropagation();
                      onTransactionAction(transaction.id, action);
                    }}
                    data-test-id={`transaction-action-${action.toLowerCase()}-button`}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      {inFlight && <SaleorThrobber size={16} />}
                      <FormattedMessage
                        {...(inFlight
                          ? mapActionToInProgressMessage[action]
                          : mapActionToMessage[action])}
                      />
                    </Box>
                  </Button>
                );
              })}

            {showActionsMenu && (
              <Dropdown>
                <Dropdown.Trigger>
                  <Button
                    variant="tertiary"
                    icon={
                      <MoreVertical
                        size={iconSize.small}
                        strokeWidth={iconStrokeWidthBySize.small}
                      />
                    }
                    onClick={e => e.stopPropagation()}
                    data-test-id="transaction-menu-button"
                    title={intl.formatMessage(buttonMessages.moreOptions)}
                  />
                </Dropdown.Trigger>
                <Dropdown.Content align="end">
                  <List
                    padding={2}
                    borderRadius={4}
                    boxShadow="defaultOverlay"
                    backgroundColor="default1"
                  >
                    {menuActions.map(action => {
                      const inFlight = transactionActionInFlight(transactionEvents, action);

                      return (
                        <Dropdown.Item key={`transaction-action-${action}`}>
                          <List.Item
                            borderRadius={4}
                            paddingX={1.5}
                            paddingY={2}
                            disabled={inFlight}
                            onClick={
                              inFlight
                                ? undefined
                                : e => {
                                    e.stopPropagation();
                                    onTransactionAction(transaction.id, action);
                                  }
                            }
                          >
                            <Box display="flex" alignItems="center" gap={2}>
                              {inFlight && <SaleorThrobber size={16} />}
                              <Text
                                color={
                                  inFlight
                                    ? "defaultDisabled"
                                    : isDestructiveAction(action)
                                      ? "critical1"
                                      : undefined
                                }
                              >
                                <FormattedMessage
                                  {...(inFlight
                                    ? mapActionToInProgressMessage[action]
                                    : mapActionToMessage[action])}
                                />
                              </Text>
                            </Box>
                          </List.Item>
                        </Dropdown.Item>
                      );
                    })}
                  </List>
                </Dropdown.Content>
              </Dropdown>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
