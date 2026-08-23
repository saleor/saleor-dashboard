import { CircuitBreakerStateEnum } from "@dashboard/graphql";

export type PaymentGatewayHealth = "paused" | "attention";

export interface PaymentGatewayHealthInput {
  breakerState?: CircuitBreakerStateEnum | null;
  problems?: Array<{ isCritical: boolean } | null> | null;
}

/**
 * App-wide health only — never "not configured". Absence of a signal is `null`,
 * not an unknown/unconfigured state.
 */
export const resolvePaymentGatewayHealth = (
  app: PaymentGatewayHealthInput,
): PaymentGatewayHealth | null => {
  if (app.breakerState === CircuitBreakerStateEnum.OPEN) {
    return "paused";
  }

  if (app.problems?.some(problem => problem?.isCritical)) {
    return "attention";
  }

  return null;
};
