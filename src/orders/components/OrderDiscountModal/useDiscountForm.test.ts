import { DiscountValueTypeEnum } from "@dashboard/graphql";
import { act, renderHook } from "@testing-library/react";

import { messages } from "./messages";
import { useDiscountForm } from "./useDiscountForm";

describe("useDiscountForm", () => {
  const defaultMaxPrice = {
    __typename: "Money" as const,
    currency: "USD",
    amount: 100,
  };

  describe("initialization", () => {
    it("should initialize with default values when no existing discount", () => {
      // Arrange & Act
      const { result } = renderHook(() => useDiscountForm({ maxPrice: defaultMaxPrice }));

      // Assert
      const data = result.current.getDiscountData();

      expect(data.value).toBe(0);
      expect(data.reason).toBe("");
      expect(data.calculationMode).toBe(DiscountValueTypeEnum.PERCENTAGE);
      expect(result.current.valueFieldSymbol).toBe("%");
      expect(result.current.isSubmitDisabled).toBe(true);
      expect(result.current.valueErrorMsg).toBeNull();
    });

    it("should initialize with existing discount values", () => {
      // Arrange
      const existingDiscount = {
        value: 25,
        reason: "Test discount",
        calculationMode: DiscountValueTypeEnum.PERCENTAGE,
      };

      // Act
      const { result } = renderHook(() =>
        useDiscountForm({ maxPrice: defaultMaxPrice, existingDiscount }),
      );

      // Assert
      const data = result.current.getDiscountData();

      expect(data.value).toBe(25);
      expect(data.reason).toBe("Test discount");
      expect(data.calculationMode).toBe(DiscountValueTypeEnum.PERCENTAGE);
    });

    it("should initialize with fixed amount discount", () => {
      // Arrange
      const existingDiscount = {
        value: 50,
        reason: "Fixed test",
        calculationMode: DiscountValueTypeEnum.FIXED,
      };

      // Act
      const { result } = renderHook(() =>
        useDiscountForm({ maxPrice: defaultMaxPrice, existingDiscount }),
      );

      // Assert
      const data = result.current.getDiscountData();

      expect(data.value).toBe(50);
      expect(data.calculationMode).toBe(DiscountValueTypeEnum.FIXED);
      expect(result.current.valueFieldSymbol).toBe("USD");
    });
  });

  describe("value handling", () => {
    it("should update value on change", () => {
      // Arrange
      const { result } = renderHook(() => useDiscountForm({ maxPrice: defaultMaxPrice }));

      // Act
      act(() => {
        result.current.setValue("value", "50");
      });

      // Assert
      expect(result.current.getValues("value")).toBe("50");
      expect(result.current.isSubmitDisabled).toBe(false);
    });

    it("should show error when percentage value exceeds 100", () => {
      // Arrange
      const { result } = renderHook(() => useDiscountForm({ maxPrice: defaultMaxPrice }));

      // Act
      act(() => {
        result.current.setValue("value", "150");
      });

      // Assert
      expect(result.current.valueErrorMsg).toBe(messages.valueBiggerThan100.defaultMessage);
      expect(result.current.isSubmitDisabled).toBe(true);
    });

    it("should show error when fixed amount exceeds max price", () => {
      // Arrange
      const { result } = renderHook(() => useDiscountForm({ maxPrice: defaultMaxPrice }));

      // Act
      act(() => {
        result.current.onCalculationModeChange(DiscountValueTypeEnum.FIXED);
      });

      act(() => {
        result.current.setValue("value", "150");
      });

      // Assert
      expect(result.current.valueErrorMsg).toBe(messages.valueBiggerThanPrice.defaultMessage);
      expect(result.current.isSubmitDisabled).toBe(true);
    });

    it("should validate empty value", () => {
      // Arrange
      const { result } = renderHook(() => useDiscountForm({ maxPrice: defaultMaxPrice }));

      // Act
      act(() => {
        result.current.setValue("value", "");
      });

      // Assert
      expect(result.current.isSubmitDisabled).toBe(true);
    });
  });

  describe("reason handling", () => {
    it("should update reason on change", () => {
      // Arrange
      const { result } = renderHook(() => useDiscountForm({ maxPrice: defaultMaxPrice }));

      // Act
      act(() => {
        result.current.setValue("reason", "Test reason");
      });

      // Assert
      expect(result.current.getValues("reason")).toBe("Test reason");
    });
  });

  describe("calculation mode handling", () => {
    it("should switch from percentage to fixed", () => {
      // Arrange
      const { result } = renderHook(() => useDiscountForm({ maxPrice: defaultMaxPrice }));

      // Act
      act(() => {
        result.current.onCalculationModeChange(DiscountValueTypeEnum.FIXED);
      });

      // Assert
      expect(result.current.getDiscountData().calculationMode).toBe(DiscountValueTypeEnum.FIXED);
      expect(result.current.valueFieldSymbol).toBe("USD");
    });

    it("should keep empty value when switching calculation mode", () => {
      // Arrange
      const { result } = renderHook(() => useDiscountForm({ maxPrice: defaultMaxPrice }));

      // Act
      act(() => {
        result.current.onCalculationModeChange(DiscountValueTypeEnum.FIXED);
      });

      // Assert
      expect(result.current.getValues("value")).toBe("");
      expect(result.current.getDiscountData().calculationMode).toBe(DiscountValueTypeEnum.FIXED);
    });

    it("should convert value when switching from percentage to fixed", () => {
      // Arrange - use maxAmount=200 to avoid degenerate case where percentage == fixed
      const maxPrice200 = { ...defaultMaxPrice, amount: 200 };
      const { result } = renderHook(() => useDiscountForm({ maxPrice: maxPrice200 }));

      act(() => {
        result.current.setValue("value", "50");
      });

      // Act
      act(() => {
        result.current.onCalculationModeChange(DiscountValueTypeEnum.FIXED);
      });

      // Assert - 50% of $200 = $100
      expect(result.current.getValues("value")).toBe("100");
    });

    it("should convert value when switching from fixed to percentage", () => {
      // Arrange - use maxAmount=200 to avoid degenerate case where percentage == fixed
      const maxPrice200 = { ...defaultMaxPrice, amount: 200 };
      const { result } = renderHook(() => useDiscountForm({ maxPrice: maxPrice200 }));

      act(() => {
        result.current.onCalculationModeChange(DiscountValueTypeEnum.FIXED);
      });

      act(() => {
        result.current.setValue("value", "50");
      });

      // Act
      act(() => {
        result.current.onCalculationModeChange(DiscountValueTypeEnum.PERCENTAGE);
      });

      // Assert - $50 of $200 = 25%
      expect(result.current.getValues("value")).toBe("25");
    });
  });

  describe("getDiscountData", () => {
    it("should return current form data", () => {
      // Arrange
      const { result } = renderHook(() => useDiscountForm({ maxPrice: defaultMaxPrice }));

      act(() => {
        result.current.setValue("value", "25");
        result.current.setValue("reason", "Test reason");
      });

      // Act
      const discountData = result.current.getDiscountData();

      // Assert
      expect(discountData).toEqual({
        value: 25,
        reason: "Test reason",
        calculationMode: DiscountValueTypeEnum.PERCENTAGE,
      });
    });
  });

  describe("form reset", () => {
    it("should reset form when isOpen changes", () => {
      // Arrange
      const existingDiscount = {
        value: 25,
        reason: "Original",
        calculationMode: DiscountValueTypeEnum.PERCENTAGE,
      };

      const { result, rerender } = renderHook(
        ({ isOpen }) => useDiscountForm({ maxPrice: defaultMaxPrice, existingDiscount, isOpen }),
        { initialProps: { isOpen: true } },
      );

      act(() => {
        result.current.setValue("value", "50");
        result.current.setValue("reason", "Modified");
      });

      expect(result.current.getValues("value")).toBe("50");
      expect(result.current.getValues("reason")).toBe("Modified");

      // Act - close and reopen
      rerender({ isOpen: false });
      rerender({ isOpen: true });

      // Assert - should reset to original values
      expect(result.current.getValues("value")).toBe("25");
      expect(result.current.getValues("reason")).toBe("Original");
    });
  });
});
