import { TransactionStatus } from "@saleor/graphql";
import { Pill } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { statusMessages } from "../messages";

export interface EventStatusProps {
  status: TransactionStatus;
}

export const EventStatus: React.FC<EventStatusProps> = ({ status }) => {
  const intl = useIntl();
  switch (status) {
    case TransactionStatus.PENDING:
      return (
        <Pill
          color="warning"
          label={intl.formatMessage(statusMessages.pending)}
        />
      );
    case TransactionStatus.SUCCESS:
      return (
        <Pill
          color="success"
          label={intl.formatMessage(statusMessages.success)}
        />
      );
    case TransactionStatus.FAILURE:
      return (
        <Pill
          color="error"
          label={intl.formatMessage(statusMessages.failure)}
        />
      );
  }
};
