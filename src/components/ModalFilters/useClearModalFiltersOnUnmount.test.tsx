import { act, renderHook, type RenderHookResult } from "@testing-library/react";
import { type History } from "history";
import { type ReactNode } from "react";
import { useHistory } from "react-router";
import { MemoryRouter } from "react-router-dom";

import { useClearModalFiltersOnUnmount } from "./useClearModalFiltersOnUnmount";

const createWrapper = (initialPath: string) => {
  // oxlint-disable-next-line react/display-name
  return ({ children }: { children: ReactNode }): JSX.Element => (
    <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
  );
};

const renderWithHistory = (
  initialPath: string,
  clearFilters: () => void,
): RenderHookResult<History, { clear: () => void }> =>
  renderHook(
    ({ clear }: { clear: () => void }) => {
      useClearModalFiltersOnUnmount(clear);

      return useHistory();
    },
    { wrapper: createWrapper(initialPath), initialProps: { clear: clearFilters } },
  );

describe("useClearModalFiltersOnUnmount", () => {
  it("clears the picker's filters when it unmounts on the same page", () => {
    // Arrange
    const clearFilters = jest.fn();
    const { unmount } = renderWithHistory("/discounts/vouchers/v-1?0=filter", clearFilters);

    // Act
    unmount();

    // Assert
    expect(clearFilters).toHaveBeenCalledTimes(1);
  });

  it("keeps the URL filters when the picker unmounts because the user left the page", () => {
    // Arrange
    const clearFilters = jest.fn();
    const { result, unmount } = renderWithHistory("/discounts/vouchers/v-1", clearFilters);

    // Act
    act(() => {
      result.current.push("/discounts/vouchers?0=list-filter");
    });
    unmount();

    // Assert
    expect(clearFilters).not.toHaveBeenCalled();
  });

  it("treats an encoded and a decoded id as the same page", () => {
    // Arrange
    const clearFilters = jest.fn();
    const { result, unmount } = renderWithHistory(
      "/discounts/vouchers/Vm91Y2hlcjox%3D%3D",
      clearFilters,
    );

    // Act
    act(() => {
      result.current.replace({ pathname: "/discounts/vouchers/Vm91Y2hlcjox==", search: "?0=x" });
    });
    unmount();

    // Assert
    expect(clearFilters).toHaveBeenCalledTimes(1);
  });

  it("treats a trailing slash as the same page", () => {
    // Arrange
    const clearFilters = jest.fn();
    const { result, unmount } = renderWithHistory("/discounts/vouchers/v-1", clearFilters);

    // Act
    act(() => {
      result.current.replace("/discounts/vouchers/v-1/?0=x");
    });
    unmount();

    // Assert
    expect(clearFilters).toHaveBeenCalledTimes(1);
  });

  it("calls the latest clearFilters", () => {
    // Arrange
    const firstClear = jest.fn();
    const latestClear = jest.fn();
    const { rerender, unmount } = renderWithHistory("/discounts/vouchers/v-1", firstClear);

    // Act
    rerender({ clear: latestClear });
    unmount();

    // Assert
    expect(firstClear).not.toHaveBeenCalled();
    expect(latestClear).toHaveBeenCalledTimes(1);
  });
});
