import { act, renderHook } from "@testing-library/react";

import { numberCellEmptyValue } from "./NumberCell";
import {
  formatNumericCellDraft,
  parseTypedNumericSeed,
  useDatagridNumericEdit,
} from "./useDatagridNumericEdit";

describe("parseTypedNumericSeed", () => {
  it("treats a missing key as no seed", () => {
    // Arrange / Act / Assert
    expect(parseTypedNumericSeed(undefined)).toEqual({ draft: "", numeric: null });
    expect(parseTypedNumericSeed("")).toEqual({ draft: "", numeric: null });
  });

  it("keeps the typed digit as both draft and number", () => {
    // Arrange / Act / Assert
    expect(parseTypedNumericSeed("5")).toEqual({ draft: "5", numeric: 5 });
    expect(parseTypedNumericSeed("5,5")).toEqual({ draft: "5.5", numeric: 5.5 });
  });
});

describe("formatNumericCellDraft", () => {
  it("renders empty for empty sentinels, not 0", () => {
    // Arrange / Act / Assert
    expect(formatNumericCellDraft(numberCellEmptyValue, numberCellEmptyValue)).toBe("");
    expect(formatNumericCellDraft(null, null)).toBe("");
    expect(formatNumericCellDraft(undefined)).toBe("");
    expect(formatNumericCellDraft(0)).toBe("0");
    expect(formatNumericCellDraft(7)).toBe("7");
  });
});

describe("useDatagridNumericEdit", () => {
  it("replaces the committed value with the typed key", () => {
    // Arrange
    const onCommit = jest.fn();

    // Act
    const { result } = renderHook(() =>
      useDatagridNumericEdit({
        committedValue: 7,
        initialValue: "5",
        onCommit,
      }),
    );

    // Assert
    expect(result.current.draft).toBe("5");
    expect(onCommit).toHaveBeenCalledWith(5);
  });

  it("starts empty when the cell is empty and nothing was typed", () => {
    // Arrange
    const onCommit = jest.fn();

    // Act
    const { result } = renderHook(() =>
      useDatagridNumericEdit({
        committedValue: numberCellEmptyValue,
        emptyValue: numberCellEmptyValue,
        onCommit,
      }),
    );

    // Assert
    expect(result.current.draft).toBe("");
    expect(onCommit).not.toHaveBeenCalled();
  });

  it("keeps a real zero as 0", () => {
    // Arrange
    const onCommit = jest.fn();

    // Act
    const { result } = renderHook(() =>
      useDatagridNumericEdit({
        committedValue: 0,
        emptyValue: null,
        onCommit,
      }),
    );

    // Assert
    expect(result.current.draft).toBe("0");
  });

  it("updates the draft as the merchant continues typing", () => {
    // Arrange
    const onCommit = jest.fn();
    const { result } = renderHook(() =>
      useDatagridNumericEdit({
        committedValue: 7,
        initialValue: "5",
        onCommit,
      }),
    );

    // Act
    act(() => {
      result.current.setDraft("52");
    });

    // Assert
    expect(result.current.draft).toBe("52");
  });
});
