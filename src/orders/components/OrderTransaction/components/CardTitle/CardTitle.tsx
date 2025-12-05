import { TransactionActionEnum } from "@dashboard/graphql";
import {
  Box,
  Button,
  Dropdown,
  ExternalLinkIcon,
  List,
  MoreOptionsIcon,
  Text,
} from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderTransactionProps } from "../../OrderTransaction";
import { ExtendedOrderTransaction } from "../../types";
import { mapActionToMessage } from "../../utils";
import { EventTime } from "../TransactionEvents/components/EventTime";
import { messages } from "./messages";
import { MoneyDisplay } from "./MoneyDisplay";

interface CardTitleProps {
  transaction: ExtendedOrderTransaction;
  onTransactionAction: OrderTransactionProps["onTransactionAction"];
  showActions?: boolean;
}

const TransactionTitle = ({
  transaction,
  index,
}: {
  transaction: ExtendedOrderTransaction;
  index: number;
}) => {
  const intl = useIntl();

  return (
    <Box display="flex" flexDirection="column" gap={0.5}>
      <Box display="flex" alignItems="center" gap={2}>
        <Text size={4} fontWeight="medium">
          {intl.formatMessage(
            {
              defaultMessage: "Transaction #{index} on {date}",
              id: "nYD7NT",
            },
            {
              date: <EventTime date={transaction.createdAt} />,
              index: index + 1,
            },
          )}
        </Text>
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
            <ExternalLinkIcon size="small" color="inherit" />
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
}: CardTitleProps) => {
  const intl = useIntl();

  const {
    refundedAmount,
    refundPendingAmount,
    authorizePendingAmount,
    cancelPendingAmount,
    chargePendingAmount,
    canceledAmount,
    chargedAmount,
    authorizedAmount,
    index = 0,
  } = transaction;

  const actions = transaction.actions.filter(action => action !== TransactionActionEnum.REFUND);
  const showActionsMenu = showActions && actions.length > 0;

  const isDestructiveAction = (action: TransactionActionEnum) =>
    action === TransactionActionEnum.CANCEL || action === TransactionActionEnum.REFUND;

  // Collect all non-zero amounts for display
  const amounts = [
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

  return (
    <Box width="100%" display="flex" justifyContent="space-between" alignItems="center" gap={4}>
      <TransactionTitle transaction={transaction} index={index} />

      <Box display="flex" gap={4} alignItems="center">
        {amounts.map(({ label, money }) => (
          <MoneyDisplay key={label.id} label={intl.formatMessage(label)} money={money} />
        ))}

        {showActionsMenu && (
          <Dropdown>
            <Dropdown.Trigger>
              <Button
                variant="tertiary"
                icon={<MoreOptionsIcon />}
                onClick={e => e.stopPropagation()}
                data-test-id="transaction-menu-button"
                title="Show more"
              />
            </Dropdown.Trigger>
            <Dropdown.Content align="end">
              <List
                padding={2}
                borderRadius={4}
                boxShadow="defaultOverlay"
                backgroundColor="default1"
              >
                {actions.map(action => (
                  <Dropdown.Item key={`transaction-action-${action}`}>
                    <List.Item
                      borderRadius={4}
                      paddingX={1.5}
                      paddingY={2}
                      onClick={e => {
                        e.stopPropagation();
                        onTransactionAction(transaction.id, action);
                      }}
                    >
                      <Text color={isDestructiveAction(action) ? "critical1" : undefined}>
                        <FormattedMessage {...mapActionToMessage[action]} />
                      </Text>
                    </List.Item>
                  </Dropdown.Item>
                ))}
              </List>
            </Dropdown.Content>
          </Dropdown>
        )}
      </Box>
    </Box>
  );
};
