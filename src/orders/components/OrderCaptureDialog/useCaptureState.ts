import { IMoney } from "@dashboard/utils/intl";
import { useMemo } from "react";

export type AuthorizationStatus = "full" | "partial" | "none" | "charged";

export interface CaptureStateInput {
  orderTotal: IMoney;
  authorizedAmount: IMoney;
  chargedAmount?: IMoney;
  orderBalance?: IMoney;
}

export interface CaptureState {
  availableToCapture: number;
  alreadyCharged: number;
  remainingToPay: number;
  status: AuthorizationStatus;
  maxCapturable: number;
  shortfall: number;
  canCaptureOrderTotal: boolean;
  orderTotalCaptured: number;
}

export const useCaptureState = ({
  orderTotal,
  authorizedAmount,
  chargedAmount,
  orderBalance,
}: CaptureStateInput): CaptureState => {
  return useMemo(() => {
    const totalAmount = orderTotal.amount;
    const authAmount = authorizedAmount.amount;
    const alreadyCharged = chargedAmount?.amount ?? 0;

    // With bucket model: authorizedAmount = what's available to capture
    const availableToCapture = authAmount;

    // Calculate what customer still owes:
    // - If orderBalance provided (multi-transaction): use it (negative balance = owes money)
    // - Otherwise: simple calculation from order total minus charged
    const remainingToPay = orderBalance
      ? Math.max(0, -orderBalance.amount)
      : totalAmount - alreadyCharged;

    // Order-wide captured amount (for display in Order section)
    const orderTotalCaptured = totalAmount - remainingToPay;

    // Determine authorization status
    const getAuthorizationStatus = (): AuthorizationStatus => {
      if (remainingToPay <= 0) {
        return "charged";
      }

      if (availableToCapture <= 0) {
        return "none";
      }

      if (availableToCapture >= remainingToPay) {
        return "full";
      }

      return "partial";
    };

    const status = getAuthorizationStatus();
    const maxCapturable = Math.max(0, availableToCapture);
    const shortfall = remainingToPay - availableToCapture;
    const canCaptureOrderTotal = availableToCapture >= remainingToPay && remainingToPay > 0;

    return {
      availableToCapture,
      alreadyCharged,
      remainingToPay,
      status,
      maxCapturable,
      shortfall,
      canCaptureOrderTotal,
      orderTotalCaptured,
    };
  }, [orderTotal, authorizedAmount, chargedAmount, orderBalance]);
};
