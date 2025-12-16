import { Button } from "@saleor/macaw-ui-next";
import { CheckIcon } from "lucide-react";
import { useIntl } from "react-intl";

import { transactionActionMessages } from "../OrderTransaction/messages";

type Props = {
  hasNoPayment: boolean;
  canMarkAsPaid: boolean;
  onMarkAsPaid?: () => void;
};

export const TransactionsApiButtons = ({ hasNoPayment, canMarkAsPaid, onMarkAsPaid }: Props) => {
  const intl = useIntl();

  if (!hasNoPayment || !canMarkAsPaid || !onMarkAsPaid) {
    return null;
  }

  return (
    <Button variant="secondary" onClick={onMarkAsPaid}>
      <CheckIcon size={16} />
      {intl.formatMessage(transactionActionMessages.markAsPaid)}
    </Button>
  );
};
