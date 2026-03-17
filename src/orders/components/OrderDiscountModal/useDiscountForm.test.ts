import { DiscountValueTypeEnum } from "@dashboard/graphql";
import { act, renderHook } from "@testing-library/react-hooks";
import { type ChangeEvent } from "react";

import { useDiscountForm } from "./useDiscountForm";

const createInputEvent = (value: string): ChangeEvent<HTMLInputElement> =>
  ({
    target: { value },
  }) as ChangeEvent<HTMLInputElement>;

const createFormChangeEvent = (value: string) => ({
  target: { value, name: "discountType" },
});

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
      expect(result.current.value).toBe("");
      expect(result.current.reason).toBe("");
      expect(result.current.calculationMode).toBe(DiscountValueTypeEnum.PERCENTAGE);
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
      expect(result.current.value).toBe("25");
      expect(result.current.reason).toBe("Test discount");
      expect(result.current.calculationMode).toBe(DiscountValueTypeEnum.PERCENTAGE);
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
      expect(result.current.value).toBe("50");
      expect(result.current.calculationMode).toBe(DiscountValueTypeEnum.FIXED);
      expect(result.current.valueFieldSymbol).toBe("USD");
    });
  });

  describe("value handling", () => {
    it("should update value on change", () => {
      // Arrange
      const { result } = renderHook(() => useDiscountForm({ maxPrice: defaultMaxPrice }));

      // Act
      act(() => {
        result.current.handleSetDiscountValue(createInputEvent("50"));
      });

      // Assert
      expect(result.current.value).toBe("50");
      expect(result.current.isSubmitDisabled).toBe(false);
    });

    it("should show error when percentage value exceeds 100", () => {
      // Arrange
      const { result } = renderHook(() => useDiscountForm({ maxPrice: defaultMaxPrice }));

      // Act
      act(() => {
        result.current.handleSetDiscountValue(createInputEvent("150"));
      });

      // Assert
      expect(result.current.valueErrorMsg).toBeTruthy();
      expect(result.current.isSubmitDisabled).toBe(true);
    });

    it("should show error when fixed amount exceeds max price", () => {
      // Arrange
      const { result } = renderHook(() => useDiscountForm({ maxPrice: defaultMaxPrice }));

      // Act
      act(() => {
        result.current.handleSetCalculationMode(createFormChangeEvent(DiscountValueTypeEnum.FIXED));
      });

      act(() => {
        result.current.handleSetDiscountValue(createInputEvent("150"));
      });

      // Assert
      expect(result.current.valueErrorMsg).toBeTruthy();
      expect(result.current.isSubmitDisabled).toBe(true);
    });

    it("should validate empty value", () => {
      // Arrange
      const { result } = renderHook(() => useDiscountForm({ maxPrice: defaultMaxPrice }));

      // Act
      act(() => {
        result.current.handleSetDiscountValue(createInputEvent(""));
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
        result.current.handleSetReason(createInputEvent("Test reason"));
      });

      // Assert
      expect(result.current.reason).toBe("Test reason");
    });
  });

  describe("calculation mode handling", () => {
    it("should switch from percentage to fixed", () => {
      // Arrange
      const { result } = renderHook(() => useDiscountForm({ maxPrice: defaultMaxPrice }));

      // Act
      act(() => {
        result.current.handleSetCalculationMode(createFormChangeEvent(DiscountValueTypeEnum.FIXED));
      });

      // Assert
      expect(result.current.calculationMode).toBe(DiscountValueTypeEnum.FIXED);
      expect(result.current.valueFieldSymbol).toBe("USD");
    });

    it("should convert value when switching from percentage to fixed", () => {
      // Arrange
      const { result } = renderHook(() => useDiscountForm({ maxPrice: defaultMaxPrice }));

      act(() => {
        result.current.handleSetDiscountValue(createInputEvent("50"));
      });

      // Act
      act(() => {
        result.current.handleSetCalculationMode(createFormChangeEvent(DiscountValueTypeEnum.FIXED));
      });

      // Assert
      expect(result.current.value).toBe("50");
    });

    it("should convert value when switching from fixed to percentage", () => {
      // Arrange
      const { result } = renderHook(() => useDiscountForm({ maxPrice: defaultMaxPrice }));

      act(() => {
        result.current.handleSetCalculationMode(createFormChangeEvent(DiscountValueTypeEnum.FIXED));
      });

      act(() => {
        result.current.handleSetDiscountValue(createInputEvent("25"));
      });

      // Act
      act(() => {
        result.current.handleSetCalculationMode(
          createFormChangeEvent(DiscountValueTypeEnum.PERCENTAGE),
        );
      });

      // Assert
      expect(result.current.value).toBe("25");
    });
  });

  describe("getDiscountData", () => {
    it("should return current form data", () => {
      // Arrange
      const { result } = renderHook(() => useDiscountForm({ maxPrice: defaultMaxPrice }));

      act(() => {
        result.current.handleSetDiscountValue(createInputEvent("25"));
        result.current.handleSetReason(createInputEvent("Test reason"));
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

      // Modify the form
      act(() => {
        result.current.handleSetDiscountValue(createInputEvent("50"));
        result.current.handleSetReason(createInputEvent("Modified"));
      });

      expect(result.current.value).toBe("50");
      expect(result.current.reason).toBe("Modified");

      // Act - close and reopen
      rerender({ isOpen: false });
      rerender({ isOpen: true });

      // Assert - should reset to original values
      expect(result.current.value).toBe("25");
      expect(result.current.reason).toBe("Original");
    });
  });
});
