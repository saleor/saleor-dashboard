import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import { useVoucherCodesClient } from "./useVoucherCodesClient";

jest.mock("uuid", () => ({ v4: () => "123456789" }));

describe("useVoucherCodesClient", () => {
  it("should add voucher code manually", () => {
    // Arrange
    const settings = {
      rowNumber: 10,
      updateListSettings: jest.fn(),
    };
    const switchToClientPagination = jest.fn();

    const { result } = renderHook(() =>
      useVoucherCodesClient(settings, switchToClientPagination),
    );

    // Act
    act(() => {
      result.current.handleAddVoucherCode("code 1");
      result.current.handleAddVoucherCode("code 2");
    });

    // Assert
    expect(switchToClientPagination).toHaveBeenCalled();
    expect(result.current.addedVoucherCodes).toEqual([
      { code: "code 2", status: "Draft" },
      { code: "code 1", status: "Draft" },
    ]);
  });

  it("should add multiple voucher codes", () => {
    // Arrange
    const settings = {
      rowNumber: 10,
      updateListSettings: jest.fn(),
    };
    const switchToClientPagination = jest.fn();

    const { result } = renderHook(() =>
      useVoucherCodesClient(settings, switchToClientPagination),
    );

    // Act
    act(() => {
      result.current.handleGenerateMultipeCodes({
        quantity: "10",
        prefix: "prefix",
      });
    });

    // Assert
    expect(switchToClientPagination).toHaveBeenCalled();
    expect(result.current.addedVoucherCodes).toEqual([
      { code: "prefix-123456789", status: "Draft" },
      { code: "prefix-123456789", status: "Draft" },
      { code: "prefix-123456789", status: "Draft" },
      { code: "prefix-123456789", status: "Draft" },
      { code: "prefix-123456789", status: "Draft" },
      { code: "prefix-123456789", status: "Draft" },
      { code: "prefix-123456789", status: "Draft" },
      { code: "prefix-123456789", status: "Draft" },
      { code: "prefix-123456789", status: "Draft" },
      { code: "prefix-123456789", status: "Draft" },
    ]);
  });
});
