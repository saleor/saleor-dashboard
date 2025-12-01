// @ts-strict-ignore
import { Pill } from "@dashboard/components/Pill";
import { TransactionEventStatus } from "@dashboard/orders/types";
import { useIntl } from "react-intl";

import { statusMessages } from "../messages";

interface EventStatusProps {
  status: TransactionEventStatus | null;
}

export const EventStatus = ({ status }: EventStatusProps) => {
  const intl = useIntl();

  switch (status) {
    case "PENDING":
      return (
        <Pill color="warning" size="small" label={intl.formatMessage(statusMessages.pending)} />
      );
    case "SUCCESS":
      return (
        <Pill color="success" size={"small"} label={intl.formatMessage(statusMessages.success)} />
      );
    case "FAILED":
      return (
        <Pill color="error" size={"small"} label={intl.formatMessage(statusMessages.failure)} />
      );
    case "REQUEST":
      return (
        <Pill color="info" size={"small"} label={intl.formatMessage(statusMessages.request)} />
      );
    case "INFO":
      return (
        <Pill color="neutral" size={"small"} label={intl.formatMessage(statusMessages.info)} />
      );
    default: {
      const _exhaustiveCheck: never = status;

      return _exhaustiveCheck;
    }
  }
};
