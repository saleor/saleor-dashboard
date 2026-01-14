import { IMoney } from "@dashboard/utils/intl";
import { renderHook } from "@testing-library/react-hooks";

import { CaptureStateInput, useCaptureState } from "./useCaptureState";

const createMoney = (amount: number, currency = "USD"): IMoney => ({
  amount,
  currency,
});

describe("useCaptureState", () => {
  describe("basic scenarios", () => {
    it("should calculate state for fully authorized order with no charges", () => {
      // Arrange
      const input: CaptureStateInput = {
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(100),
      };

      // Act
      const { result } = renderHook(() => useCaptureState(input));

      // Assert
      expect(result.current).toEqual({
        availableToCapture: 100,
        alreadyCharged: 0,
        remainingToPay: 100,
        status: "full",
        maxCapturable: 100,
        shortfall: 0,
        canCaptureOrderTotal: true,
        orderTotalCaptured: 0,
      });
    });

    it("should calculate state for partially authorized order", () => {
      // Arrange
      const input: CaptureStateInput = {
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(60),
      };

      // Act
      const { result } = renderHook(() => useCaptureState(input));

      // Assert
      expect(result.current).toEqual({
        availableToCapture: 60,
        alreadyCharged: 0,
        remainingToPay: 100,
        status: "partial",
        maxCapturable: 60,
        shortfall: 40,
        canCaptureOrderTotal: false,
        orderTotalCaptured: 0,
      });
    });

    it("should calculate state for order with no authorization", () => {
      // Arrange
      const input: CaptureStateInput = {
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(0),
      };

      // Act
      const { result } = renderHook(() => useCaptureState(input));

      // Assert
      expect(result.current).toEqual({
        availableToCapture: 0,
        alreadyCharged: 0,
        remainingToPay: 100,
        status: "none",
        maxCapturable: 0,
        shortfall: 100,
        canCaptureOrderTotal: false,
        orderTotalCaptured: 0,
      });
    });
  });

  describe("with charged amounts", () => {
    it("should calculate state for partially charged order", () => {
      // Arrange
      const input: CaptureStateInput = {
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(80),
        chargedAmount: createMoney(20),
      };

      // Act
      const { result } = renderHook(() => useCaptureState(input));

      // Assert
      expect(result.current).toEqual({
        availableToCapture: 80,
        alreadyCharged: 20,
        remainingToPay: 80,
        status: "full",
        maxCapturable: 80,
        shortfall: 0,
        canCaptureOrderTotal: true,
        orderTotalCaptured: 20,
      });
    });

    it("should calculate state for fully charged order", () => {
      // Arrange
      const input: CaptureStateInput = {
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(0),
        chargedAmount: createMoney(100),
      };

      // Act
      const { result } = renderHook(() => useCaptureState(input));

      // Assert
      expect(result.current).toEqual({
        availableToCapture: 0,
        alreadyCharged: 100,
        remainingToPay: 0,
        status: "charged",
        maxCapturable: 0,
        shortfall: 0,
        canCaptureOrderTotal: false,
        orderTotalCaptured: 100,
      });
    });

    it("should calculate state when charged amount equals order total", () => {
      // Arrange
      const input: CaptureStateInput = {
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(50),
        chargedAmount: createMoney(100),
      };

      // Act
      const { result } = renderHook(() => useCaptureState(input));

      // Assert
      expect(result.current).toEqual({
        availableToCapture: 50,
        alreadyCharged: 100,
        remainingToPay: 0,
        status: "charged",
        maxCapturable: 50,
        shortfall: -50,
        canCaptureOrderTotal: false,
        orderTotalCaptured: 100,
      });
    });
  });

  describe("with order balance (multi-transaction)", () => {
    it("should use order balance when provided (negative balance = customer owes)", () => {
      // Arrange
      const input: CaptureStateInput = {
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(40),
        chargedAmount: createMoney(20),
        orderBalance: createMoney(-30), // Customer owes 30
      };

      // Act
      const { result } = renderHook(() => useCaptureState(input));

      // Assert
      expect(result.current).toEqual({
        availableToCapture: 40,
        alreadyCharged: 20,
        remainingToPay: 30, // From orderBalance
        status: "full",
        maxCapturable: 40,
        shortfall: -10,
        canCaptureOrderTotal: true,
        orderTotalCaptured: 70, // 100 - 30
      });
    });

    it("should handle zero order balance (fully paid)", () => {
      // Arrange
      const input: CaptureStateInput = {
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(50),
        chargedAmount: createMoney(80),
        orderBalance: createMoney(0),
      };

      // Act
      const { result } = renderHook(() => useCaptureState(input));

      // Assert
      expect(result.current).toEqual({
        availableToCapture: 50,
        alreadyCharged: 80,
        remainingToPay: 0,
        status: "charged",
        maxCapturable: 50,
        shortfall: -50,
        canCaptureOrderTotal: false,
        orderTotalCaptured: 100,
      });
    });

    it("should handle positive order balance (overpaid)", () => {
      // Arrange
      const input: CaptureStateInput = {
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(20),
        chargedAmount: createMoney(120),
        orderBalance: createMoney(20), // Overpaid by 20
      };

      // Act
      const { result } = renderHook(() => useCaptureState(input));

      // Assert
      expect(result.current).toEqual({
        availableToCapture: 20,
        alreadyCharged: 120,
        remainingToPay: 0, // Math.max(0, -20) = 0
        status: "charged",
        maxCapturable: 20,
        shortfall: -20,
        canCaptureOrderTotal: false,
        orderTotalCaptured: 100,
      });
    });
  });

  describe("edge cases", () => {
    it("should handle zero order total", () => {
      // Arrange
      const input: CaptureStateInput = {
        orderTotal: createMoney(0),
        authorizedAmount: createMoney(0),
      };

      // Act
      const { result } = renderHook(() => useCaptureState(input));

      // Assert
      expect(result.current).toEqual({
        availableToCapture: 0,
        alreadyCharged: 0,
        remainingToPay: 0,
        status: "charged",
        maxCapturable: 0,
        shortfall: 0,
        canCaptureOrderTotal: false,
        orderTotalCaptured: 0,
      });
    });

    it("should handle over-authorization", () => {
      // Arrange
      const input: CaptureStateInput = {
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(150),
      };

      // Act
      const { result } = renderHook(() => useCaptureState(input));

      // Assert
      expect(result.current).toEqual({
        availableToCapture: 150,
        alreadyCharged: 0,
        remainingToPay: 100,
        status: "full",
        maxCapturable: 150,
        shortfall: -50,
        canCaptureOrderTotal: true,
        orderTotalCaptured: 0,
      });
    });

    it("should handle negative authorized amount", () => {
      // Arrange
      const input: CaptureStateInput = {
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(-10),
      };

      // Act
      const { result } = renderHook(() => useCaptureState(input));

      // Assert
      expect(result.current).toEqual({
        availableToCapture: -10,
        alreadyCharged: 0,
        remainingToPay: 100,
        status: "none",
        maxCapturable: 0, // Math.max(0, -10)
        shortfall: 110,
        canCaptureOrderTotal: false,
        orderTotalCaptured: 0,
      });
    });
  });
});
