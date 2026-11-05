import { act, renderHook, type RenderHookResult } from "@testing-library/react";

import useLocalPageInfo from "./useLocalPageInfo";

const PAGE_SIZE = 10;

const items = (count: number): string[] =>
  Array.from({ length: count }, (_, index) => `item-${index + 1}`);

type PageInfoHook = RenderHookResult<
  ReturnType<typeof useLocalPageInfo<string>>,
  { values: string[]; paginateBy: number }
>;

const renderPageInfo = (
  values: string[],
  { paginateBy = PAGE_SIZE, clampToLastPage = false } = {},
): PageInfoHook =>
  renderHook(
    ({ values, paginateBy }) => useLocalPageInfo(values, paginateBy, { clampToLastPage }),
    { initialProps: { values, paginateBy } },
  );

describe("useLocalPageInfo", () => {
  it("shows the first page and offers the next one", () => {
    // Arrange & Act
    const { result } = renderPageInfo(items(11));

    // Assert
    expect(result.current.pageValues).toEqual(items(10));
    expect(result.current.pageInfo).toMatchObject({ hasNextPage: true, hasPreviousPage: false });
  });

  it("moves to the next page", () => {
    // Arrange
    const { result } = renderPageInfo(items(11));

    // Act
    act(() => {
      result.current.loadNextPage();
    });

    // Assert
    expect(result.current.pageValues).toEqual(["item-11"]);
    expect(result.current.pageInfo).toMatchObject({ hasNextPage: false, hasPreviousPage: true });
  });

  it("goes back to the last page when removing items empties the current one", () => {
    // Arrange
    const { result, rerender } = renderPageInfo(items(11), { clampToLastPage: true });

    act(() => {
      result.current.loadNextPage();
    });

    // Act
    rerender({ values: items(10), paginateBy: PAGE_SIZE });

    // Assert
    expect(result.current.pageValues).toEqual(items(10));
    expect(result.current.pageInfo).toMatchObject({
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: 0,
    });
  });

  it("stays on the current page while it still has items", () => {
    // Arrange
    const { result, rerender } = renderPageInfo(items(21), { clampToLastPage: true });

    act(() => {
      result.current.loadNextPage();
    });

    // Act
    rerender({ values: items(15), paginateBy: PAGE_SIZE });

    // Assert
    expect(result.current.pageValues).toEqual(items(15).slice(10));
    expect(result.current.pageInfo).toMatchObject({ hasPreviousPage: true, startCursor: 10 });
  });

  it("does not jump forward again when items come back after a removal", () => {
    // Arrange
    const { result, rerender } = renderPageInfo(items(11), { clampToLastPage: true });

    act(() => {
      result.current.loadNextPage();
    });
    rerender({ values: items(10), paginateBy: PAGE_SIZE });

    // Act
    rerender({ values: items(11), paginateBy: PAGE_SIZE });

    // Assert
    expect(result.current.pageValues).toEqual(items(10));
    expect(result.current.pageInfo).toMatchObject({ hasNextPage: true, hasPreviousPage: false });
  });

  it("keeps a page past the end without clampToLastPage, for callers that continue on the server", () => {
    // Arrange
    const { result, rerender } = renderPageInfo(items(11));

    act(() => {
      result.current.loadNextPage();
    });

    // Act
    rerender({ values: items(10), paginateBy: PAGE_SIZE });

    // Assert
    expect(result.current.pageValues).toEqual([]);
    expect(result.current.pageInfo).toMatchObject({ hasPreviousPage: true, startCursor: 10 });
  });

  it("returns to the first page when the page size changes", () => {
    // Arrange
    const { result, rerender } = renderPageInfo(items(25));

    act(() => {
      result.current.loadNextPage();
    });

    // Act
    rerender({ values: items(25), paginateBy: 20 });

    // Assert
    expect(result.current.pageValues).toEqual(items(20));
  });

  it("does not loop when the page size is zero", () => {
    // Arrange & Act
    const { result } = renderPageInfo(items(1), { paginateBy: 0, clampToLastPage: true });

    // Assert
    expect(result.current.pageInfo.hasPreviousPage).toBe(false);
  });

  it("does not go before the first page", () => {
    // Arrange
    const { result } = renderPageInfo(items(11));

    // Act
    act(() => {
      result.current.loadPreviousPage();
    });

    // Assert
    expect(result.current.pageValues).toEqual(items(10));
    expect(result.current.pageInfo).toMatchObject({ hasPreviousPage: false, startCursor: 0 });
  });
});
