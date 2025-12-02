import { Pill } from "@dashboard/components/Pill";
import { OrderAuthorizeStatusEnum } from "@dashboard/graphql";
import { useIntl } from "react-intl";

interface OrderAuthorizeStatusBadgeProps {
  status: OrderAuthorizeStatusEnum;
}

export const OrderAuthorizeStatusBadge = ({ status }: OrderAuthorizeStatusBadgeProps) => {
  const intl = useIntl();

  switch (status) {
    case OrderAuthorizeStatusEnum.FULL:
      return (
        <Pill
          color="success"
          label={intl.formatMessage({
            defaultMessage: "Fully authorised",
            id: "wVjyOX",
          })}
        />
      );

    case OrderAuthorizeStatusEnum.NONE:
      return (
        <Pill
          color="neutral"
          label={intl.formatMessage({
            defaultMessage: "Not fully authorised",
            id: "l1pZJx",
          })}
        />
      );

    case OrderAuthorizeStatusEnum.PARTIAL:
    default:
      return null;
  }
};
