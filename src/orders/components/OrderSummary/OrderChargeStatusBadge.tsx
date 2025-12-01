import { Pill } from "@dashboard/components/Pill";
import { OrderChargeStatusEnum } from "@dashboard/graphql";
import { BanknoteIcon } from "lucide-react";
import { useIntl } from "react-intl";

interface OrderChargeStatusBadgeProps {
  status: OrderChargeStatusEnum;
}

export const OrderChargeStatusBadge = ({ status }: OrderChargeStatusBadgeProps) => {
  const intl = useIntl();

  switch (status) {
    case OrderChargeStatusEnum.FULL:
      return (
        <Pill
          color="success"
          icon={<BanknoteIcon size={16} />}
          label={intl.formatMessage({
            defaultMessage: "Fully charged",
            id: "Ynjq+C",
          })}
        />
      );

    case OrderChargeStatusEnum.OVERCHARGED:
      return (
        <Pill
          color="attention"
          label={intl.formatMessage({
            defaultMessage: "Overcharged",
            id: "8Cjxdt",
          })}
        />
      );

    case OrderChargeStatusEnum.PARTIAL:
    case OrderChargeStatusEnum.NONE:
      return (
        <Pill
          color="neutral"
          label={intl.formatMessage({
            defaultMessage: "Not fully charged",
            id: "X9tptP",
          })}
        />
      );

    default:
      return null;
  }
};
