import { Pill } from "@dashboard/components/Pill";
import { OrderChargeStatusEnum, OrderDetailsFragment } from "@dashboard/graphql";
import { transformPaymentStatus } from "@dashboard/misc";
import { useIntl } from "react-intl";

type Order = Pick<OrderDetailsFragment, "paymentStatus" | "chargeStatus">;

export interface OrderPaymentStatusPillProps {
  order: Order | undefined;
  className?: string;
}

export const OrderPaymentStatusPill = ({ order, className }: OrderPaymentStatusPillProps) => {
  const intl = useIntl();

  if (!order) {
    return null;
  }

  const payment = transformPaymentStatus(order.paymentStatus, intl);

  if (order.chargeStatus === OrderChargeStatusEnum.OVERCHARGED) {
    return (
      <Pill
        key="overcharged"
        label={intl.formatMessage({
          defaultMessage: "Overcharged",
          id: "BXKn/d",
          description: "charge status",
        })}
        color="attention"
        style={{ alignSelf: "flex-end" }}
        className={className}
      />
    );
  }

  return (
    <Pill
      key={payment.status}
      label={payment.localized}
      color={payment.status}
      style={{ alignSelf: "flex-end" }}
      data-test-id="payment-status"
      className={className}
    />
  );
};
