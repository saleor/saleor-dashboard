import { type Locale } from "@dashboard/components/Locale";
import { formatMoney } from "@dashboard/components/Money";

export const formatRefundColumnValue = (
  quantity: number,
  amount: { amount: number; currency: string } | null | undefined,
  locale: Locale,
): string => {
  if (quantity <= 0) {
    return "—";
  }

  const quantityLabel = quantity.toString();

  if (!amount || amount.amount <= 0) {
    return quantityLabel;
  }

  return `${quantityLabel} · ${formatMoney(amount, locale)}`;
};
