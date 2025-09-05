import { Select } from "@dashboard/components/Select";
import { OrderDetailsFragment } from "@dashboard/graphql";
import { ChangeEvent, FormChange } from "@dashboard/hooks/useForm";
import useLocale from "@dashboard/hooks/useLocale";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

interface TransactionSelectorProps {
  transactions: OrderDetailsFragment["transactions"];
  onChange: FormChange;
  value?: string;
}

export const TransactionSelector = ({
  transactions,
  onChange,
  value,
}: TransactionSelectorProps) => {
  const { locale } = useLocale();
  const intl = useIntl();
  const dateIntl = new Intl.DateTimeFormat(locale, {
    timeZoneName: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const options = transactions
    .filter(
      transaction =>
        transaction.chargedAmount.amount > 0 || transaction.authorizedAmount.amount > 0,
    )
    .map((transaction, index) => {
      const number = index + 1;
      const date = dateIntl.format(new Date(transaction.createdAt));
      const amount = transaction.chargedAmount.amount;
      const currency = transaction.chargedAmount.currency;

      return {
        label: `#${number} ${date}`,
        value: transaction.id,
        endAdornment: (
          <Text whiteSpace="nowrap" fontWeight="medium">
            {amount} {currency}
          </Text>
        ),
      };
    });

  if (options.length === 0) {
    return (
      <Text as="p" size={2} color="warning1" marginBottom={4}>
        {intl.formatMessage({
          defaultMessage:
            "You cannot issue a granted refund for this order. None of your transactions have authorized or charged amount.",
          id: "IWP25U",
        })}
      </Text>
    );
  }

  const selectedTransaction = options.find(transaction => transaction.value === value);

  const handleChange = (event: ChangeEvent) => {
    onChange({
      target: {
        name: "transactionId",
        value: event.target.value,
      },
    });
  };

  return (
    <Box width="100%" marginBottom={5}>
      <Text as="p" size={2} color="default2" marginBottom={4}>
        {intl.formatMessage({
          defaultMessage:
            "When issuing a granted refund, please select the transaction you wish to apply the refund to.",
          id: "r4UnCw",
        })}
      </Text>
      <Select
        data-test-id="transaction-selector"
        width="100%"
        size="large"
        endAdornment={() => selectedTransaction?.endAdornment}
        onChange={handleChange}
        label={intl.formatMessage({
          defaultMessage: "Select transaction",
          id: "qy/XqL",
        })}
        value={value || null}
        options={options}
      />
    </Box>
  );
};
