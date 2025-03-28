import { VoucherCreatePageTab } from "@dashboard/discounts/components/VoucherCreatePage/types";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import { useActiveTab } from "./useActiveTab";

describe("VoucherCreatePage / hooks / useActiveTab", () => {
  it("should set active tab and fire reset", async () => {
    // Arrange
    const reset = jest.fn();
    const { result } = renderHook(() => useActiveTab());

    // Assert
    expect(result.current.activeTab).toBe("categories");

    // Act
    await act(async () => {
      result.current.changeTab(VoucherCreatePageTab.products, reset);
    });

    // Assert
    expect(result.current.activeTab).toBe("products");
    expect(reset).toBeCalled();
  });
});
