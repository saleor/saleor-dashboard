import { CircuitBreakerStateEnum } from "@dashboard/graphql";

export type PaymentGatewayHealth = "paused" | "attention";

export interface PaymentGatewayHealthInput {
  breakerState?: CircuitBreakerStateEnum | null;
  criticalProblemMessages?: string[];
}

/**
 * App-wide health, not per-channel: Saleor has no signal for "is this gateway
 * configured for this channel". HALF_OPEN is deliberately silent — the breaker
 * is already probing recovery, so surfacing it would flap.
 */
export const resolvePaymentGatewayHealth = (
  app: PaymentGatewayHealthInput,
): PaymentGatewayHealth | null => {
  if (app.breakerState === CircuitBreakerStateEnum.OPEN) {
    return "paused";
  }

  if (app.criticalProblemMessages?.length) {
    return "attention";
  }

  return null;
};
