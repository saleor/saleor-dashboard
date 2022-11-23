import { TransactionEventStatus } from "@saleor/graphql";
import { Pill } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { statusMessages } from "./messages";

export interface EventStatusProps {
  status: TransactionEventStatus;
}

const EventStatus: React.FC<EventStatusProps> = ({ status }) => {
  const intl = useIntl();
  switch (status) {
    case TransactionEventStatus.PENDING:
      return (
        <Pill
          color="warning"
          label={intl.formatMessage(statusMessages.pending)}
        />
      );
    case TransactionEventStatus.SUCCESS:
      return (
        <Pill
          color="success"
          label={intl.formatMessage(statusMessages.success)}
        />
      );
    case TransactionEventStatus.FAILURE:
      return (
        <Pill
          color="error"
          label={intl.formatMessage(statusMessages.failure)}
        />
      );
  }
};

export default EventStatus;
