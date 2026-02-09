import { act, renderHook } from "@testing-library/react-hooks";

import useFormset, { FormsetAtomicData } from "./useFormset";

interface TestData {
  name: string;
}

interface TestAdditionalData {
  count: number;
}

type TestFormsetData = FormsetAtomicData<TestData, string, TestAdditionalData>;

describe("useFormset", () => {
  describe("get", () => {
    test("should throw error when item not found", () => {
      // Arrange
      const initialData: TestFormsetData[] = [
        {
          id: "1",
          label: "Item 1",
          value: "value1",
          data: { name: "Test 1" },
        },
      ];
      const { result } = renderHook(() => useFormset(initialData));

      // Act & Assert
      expect(() => result.current.get("non-existent-id")).toThrow(
        'Item with id "non-existent-id" not found in formset',
      );
    });

    test("should return item when found", () => {
      // Arrange
      const initialData: TestFormsetData[] = [
        {
          id: "1",
          label: "Item 1",
          value: "value1",
          data: { name: "Test 1" },
        },
      ];
      const { result } = renderHook(() => useFormset(initialData));

      // Act
      const item = result.current.get("1");

      // Assert
      expect(item).toEqual({
        id: "1",
        label: "Item 1",
        value: "value1",
        data: { name: "Test 1" },
      });
    });
  });

  describe("setAdditionalData with merge", () => {
    test("should use additionalData directly when item.additionalData is undefined", () => {
      // Arrange
      const initialData: TestFormsetData[] = [
        {
          id: "1",
          label: "Item 1",
          value: "value1",
          data: { name: "Test 1" },
          // additionalData is undefined
        },
      ];
      const { result } = renderHook(() => useFormset(initialData));
      const mergeFn = jest.fn((prev: TestAdditionalData, next: TestAdditionalData) => ({
        count: prev.count + next.count,
      }));

      // Act
      act(() => {
        result.current.setAdditionalData("1", { count: 5 }, mergeFn);
      });

      // Assert
      expect(mergeFn).not.toHaveBeenCalled();
      expect(result.current.data[0].additionalData).toEqual({ count: 5 });
    });

    test("should call merge function when item.additionalData is defined", () => {
      // Arrange
      const initialData: TestFormsetData[] = [
        {
          id: "1",
          label: "Item 1",
          value: "value1",
          data: { name: "Test 1" },
          additionalData: { count: 10 },
        },
      ];
      const { result } = renderHook(() => useFormset(initialData));
      const mergeFn = jest.fn((prev: TestAdditionalData, next: TestAdditionalData) => ({
        count: prev.count + next.count,
      }));

      // Act
      act(() => {
        result.current.setAdditionalData("1", { count: 5 }, mergeFn);
      });

      // Assert
      expect(mergeFn).toHaveBeenCalledWith({ count: 10 }, { count: 5 });
      expect(result.current.data[0].additionalData).toEqual({ count: 15 });
    });

    test("should use additionalData directly when no merge function provided", () => {
      // Arrange
      const initialData: TestFormsetData[] = [
        {
          id: "1",
          label: "Item 1",
          value: "value1",
          data: { name: "Test 1" },
          additionalData: { count: 10 },
        },
      ];
      const { result } = renderHook(() => useFormset(initialData));

      // Act
      act(() => {
        result.current.setAdditionalData("1", { count: 5 });
      });

      // Assert
      expect(result.current.data[0].additionalData).toEqual({ count: 5 });
    });
  });
});
