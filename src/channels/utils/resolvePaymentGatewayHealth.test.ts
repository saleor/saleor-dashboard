import { CircuitBreakerStateEnum } from "@dashboard/graphql";

import {
  type PaymentGatewayHealthInput,
  resolvePaymentGatewayHealth,
} from "./resolvePaymentGatewayHealth";

describe("resolvePaymentGatewayHealth", () => {
  it("returns paused when the circuit breaker is open", () => {
    // Arrange
    const app: PaymentGatewayHealthInput = {
      breakerState: CircuitBreakerStateEnum.OPEN,
      criticalProblemMessages: [],
    };

    // Act
    const health = resolvePaymentGatewayHealth(app);

    // Assert
    expect(health).toBe("paused");
  });

  it("prefers paused over a critical problem when the breaker is open", () => {
    // Arrange
    const app: PaymentGatewayHealthInput = {
      breakerState: CircuitBreakerStateEnum.OPEN,
      criticalProblemMessages: ["Missing API key"],
    };

    // Act
    const health = resolvePaymentGatewayHealth(app);

    // Assert
    expect(health).toBe("paused");
  });

  it("returns attention when the app has a critical problem", () => {
    // Arrange
    const app: PaymentGatewayHealthInput = {
      breakerState: CircuitBreakerStateEnum.CLOSED,
      criticalProblemMessages: ["Missing API key"],
    };

    // Act
    const health = resolvePaymentGatewayHealth(app);

    // Assert
    expect(health).toBe("attention");
  });

  it("returns null when the breaker is half-open and no problem is critical", () => {
    // Arrange
    const app: PaymentGatewayHealthInput = {
      breakerState: CircuitBreakerStateEnum.HALF_OPEN,
      criticalProblemMessages: [],
    };

    // Act
    const health = resolvePaymentGatewayHealth(app);

    // Assert
    expect(health).toBeNull();
  });

  it("returns null when there is no health signal", () => {
    // Arrange
    const app: PaymentGatewayHealthInput = {
      breakerState: CircuitBreakerStateEnum.CLOSED,
      criticalProblemMessages: [],
    };

    // Act
    const health = resolvePaymentGatewayHealth(app);

    // Assert
    expect(health).toBeNull();
  });

  it("returns null when the health signals are missing", () => {
    // Arrange & Act
    const health = resolvePaymentGatewayHealth({});

    // Assert
    expect(health).toBeNull();
  });
});
