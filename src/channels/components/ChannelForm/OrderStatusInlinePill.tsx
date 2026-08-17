import { Pill } from "@dashboard/components/Pill";
import { type OrderStatus } from "@dashboard/graphql";
import { transformOrderStatus } from "@dashboard/misc";
import { useIntl } from "react-intl";

import styles from "./OrderStatusInlinePill.module.css";

interface OrderStatusInlinePillProps {
  status: OrderStatus;
}

/** Compact order-status pill for use inside helper copy. */
export const OrderStatusInlinePill = ({ status }: OrderStatusInlinePillProps) => {
  const intl = useIntl();
  const { localized, status: color } = transformOrderStatus(status, intl);

  return <Pill className={styles.inlinePill} label={localized} color={color} size="small" />;
};
