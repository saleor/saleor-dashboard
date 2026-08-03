import { act, renderHook } from "@testing-library/react";

import { PICKER_BACKFILL_MAX_PAGES } from "./pickerBackfill";
import { usePickerBackfill } from "./usePickerBackfill";

const PAGE_SIZE = 100;

describe("usePickerBackfill", () => {
  const setup = (overrides: Partial<Parameters<typeof usePickerBackfill>[0]> = {}) => {
    const onFetchMore = jest.fn();
    const initialProps = {
      enabled: true,
      open: true,
      loading: false,
      hasMore: true,
      rawItemCount: PAGE_SIZE,
      filteredItemCount: 0,
      onFetchMore,
      ...overrides,
    };

    const view = renderHook(props => usePickerBackfill(props), { initialProps });

    /** Stands in for the next page of results landing, still fully filtered away. */
    const landPage = (pageNumber: number) =>
      view.rerender({ ...initialProps, rawItemCount: PAGE_SIZE * pageNumber });

    return { ...view, landPage, onFetchMore };
  };

  it("pulls in pages while the filtered list stays empty", () => {
    // Act
    const { onFetchMore, result } = setup();

    // Assert — an empty list is not yet a real empty state
    expect(onFetchMore).toHaveBeenCalledTimes(1);
    expect(result.current.isBackfilling).toBe(true);
    expect(result.current.isExhausted).toBe(false);
  });

  it("stops and reports a dead end once the page budget is spent", () => {
    // Arrange
    const { landPage, onFetchMore, result } = setup();

    // Act — every page arrives fully filtered away
    for (let page = 2; page <= PICKER_BACKFILL_MAX_PAGES + 1; page += 1) {
      landPage(page);
    }

    // Assert — the picker must offer a way forward instead of claiming no products exist
    expect(onFetchMore).toHaveBeenCalledTimes(PICKER_BACKFILL_MAX_PAGES);
    expect(result.current.isExhausted).toBe(true);
    expect(result.current.isBackfilling).toBe(false);
  });

  it("resumes fetching when the user asks for more products", () => {
    // Arrange
    const { landPage, onFetchMore, result } = setup();

    for (let page = 2; page <= PICKER_BACKFILL_MAX_PAGES + 1; page += 1) {
      landPage(page);
    }

    // Act
    act(() => result.current.resumeBackfill());

    // Assert — the budget is handed back and the effect pulls the next page
    expect(onFetchMore).toHaveBeenCalledTimes(PICKER_BACKFILL_MAX_PAGES + 1);
    expect(result.current.isExhausted).toBe(false);
    expect(result.current.isBackfilling).toBe(true);
  });

  it("ignores resume while the budget is still being spent", () => {
    // Arrange — mid-backfill, one page already requested
    const { onFetchMore, result } = setup();

    expect(onFetchMore).toHaveBeenCalledTimes(1);

    // Act — a second click must not reset requestedAtRawCount and re-fetch the same cursor
    act(() => result.current.resumeBackfill());

    // Assert
    expect(onFetchMore).toHaveBeenCalledTimes(1);
    expect(result.current.isBackfilling).toBe(true);
  });

  it.each([
    ["the caller filters nothing out", { enabled: false }],
    ["the dialog is closed", { open: false }],
    ["the catalog has no more pages", { hasMore: false }],
    ["the list is long enough to scroll", { filteredItemCount: 20 }],
  ])("stays idle when %s", (_, override) => {
    // Act
    const { onFetchMore, result } = setup(override);

    // Assert
    expect(onFetchMore).not.toHaveBeenCalled();
    expect(result.current).toMatchObject({ isBackfilling: false, isExhausted: false });
  });

  it("hands the budget back when a new search starts", () => {
    // Arrange
    const onFetchMore = jest.fn();
    const props = {
      enabled: true,
      open: true,
      loading: false,
      hasMore: true,
      rawItemCount: PAGE_SIZE,
      filteredItemCount: 0,
      onFetchMore,
      resetKey: "1",
    };
    const { rerender, result } = renderHook(p => usePickerBackfill(p), { initialProps: props });

    // Act — a fresh search replaces the results
    rerender({ ...props, resetKey: "2" });

    // Assert
    expect(result.current.isExhausted).toBe(false);
    expect(onFetchMore).toHaveBeenCalled();
  });
});
