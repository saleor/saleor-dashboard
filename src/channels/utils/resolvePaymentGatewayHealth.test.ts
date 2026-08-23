import { CircuitBreakerStateEnum } from "@dashboard/graphql";

import { resolvePaymentGatewayHealth } from "./resolvePaymentGatewayHealth";

describe("resolvePaymentGatewayHealth", () => {
  it("returns paused when the circuit breaker is open", () => {
    // Arrange
    const app = {
      breakerState: CircuitBreakerStateEnum.OPEN,
      problems: [],
    };

    // Act
    const health = resolvePaymentGatewayHealth(app);

    // Assert
    expect(health).toBe("paused");
  });

  it("prefers paused over a critical problem when the breaker is open", () => {
    // Arrange
    const app = {
      breakerState: CircuitBreakerStateEnum.OPEN,
      problems: [{ isCritical: true }],
    };

    // Act
    const health = resolvePaymentGatewayHealth(app);

    // Assert
    expect(health).toBe("paused");
  });

  it("returns attention when a problem is critical", () => {
    // Arrange
    const app = {
      breakerState: CircuitBreakerStateEnum.CLOSED,
      problems: [{ isCritical: false }, { isCritical: true }],
    };

    // Act
    const health = resolvePaymentGatewayHealth(app);

    // Assert
    expect(health).toBe("attention");
  });

  it("returns null when the breaker is half-open and problems are not critical", () => {
    // Arrange
    const app = {
      breakerState: CircuitBreakerStateEnum.HALF_OPEN,
      problems: [{ isCritical: false }],
    };

    // Act
    const health = resolvePaymentGatewayHealth(app);

    // Assert
    expect(health).toBeNull();
  });

  it("returns null when there is no health signal", () => {
    // Arrange
    const app = {
      breakerState: CircuitBreakerStateEnum.CLOSED,
      problems: [],
    };

    // Act
    const health = resolvePaymentGatewayHealth(app);

    // Assert
    expect(health).toBeNull();
  });

  it("returns null when problems and breaker state are missing", () => {
    // Arrange & Act
    const health = resolvePaymentGatewayHealth({});

    // Assert
    expect(health).toBeNull();
  });
});
