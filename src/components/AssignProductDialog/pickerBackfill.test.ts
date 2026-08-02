import {
  createPickerBackfillState,
  PICKER_BACKFILL_MAX_PAGES,
  planPickerBackfill,
} from "./pickerBackfill";

describe("planPickerBackfill", () => {
  const baseArgs = {
    enabled: true,
    loading: false,
    hasMore: true,
    rawItemCount: 50,
    filteredItemCount: 2,
  };

  it("requests another page when the filtered list is too short to scroll", () => {
    // Arrange
    const state = createPickerBackfillState();

    // Act
    const plan = planPickerBackfill({ ...baseArgs, state });

    // Assert
    expect(plan.shouldFetchMore).toBe(true);
    expect(plan.state).toEqual({ requestedAtRawCount: 50, requestedPages: 1 });
  });

  it("requests a page when the whole page was filtered away", () => {
    // Arrange — the picker would otherwise show "no products found" with pages still available
    const state = createPickerBackfillState();

    // Act
    const plan = planPickerBackfill({ ...baseArgs, state, filteredItemCount: 0 });

    // Assert
    expect(plan.shouldFetchMore).toBe(true);
  });

  it("does not request twice for the same results while a page is still in flight", () => {
    // Arrange
    const first = planPickerBackfill({ ...baseArgs, state: createPickerBackfillState() });

    // Act — Apollo 3.4 keeps `loading` false during fetchMore, so the effect re-runs unchanged
    const second = planPickerBackfill({ ...baseArgs, state: first.state });

    // Assert
    expect(second.shouldFetchMore).toBe(false);
    expect(second.state).toEqual(first.state);
  });

  it("requests again once new results arrive", () => {
    // Arrange
    const first = planPickerBackfill({ ...baseArgs, state: createPickerBackfillState() });

    // Act
    const second = planPickerBackfill({ ...baseArgs, state: first.state, rawItemCount: 100 });

    // Assert
    expect(second.shouldFetchMore).toBe(true);
    expect(second.state).toEqual({ requestedAtRawCount: 100, requestedPages: 2 });
  });

  it("stops after the page budget is spent", () => {
    // Arrange
    let state = createPickerBackfillState();
    let rawItemCount = 50;

    for (let page = 0; page < PICKER_BACKFILL_MAX_PAGES; page += 1) {
      state = planPickerBackfill({ ...baseArgs, state, rawItemCount }).state;
      rawItemCount += 50;
    }

    // Act
    const plan = planPickerBackfill({ ...baseArgs, state, rawItemCount });

    // Assert
    expect(plan.shouldFetchMore).toBe(false);
  });

  it("restarts the budget when a new search shrinks the result list", () => {
    // Arrange
    const spent = {
      requestedAtRawCount: 200,
      requestedPages: PICKER_BACKFILL_MAX_PAGES,
    };

    // Act
    const plan = planPickerBackfill({ ...baseArgs, state: spent, rawItemCount: 20 });

    // Assert
    expect(plan.shouldFetchMore).toBe(true);
    expect(plan.state).toEqual({ requestedAtRawCount: 20, requestedPages: 1 });
  });

  it.each([
    ["nothing is filtered out", { enabled: false }],
    ["a request is already known to be in flight", { loading: true }],
    ["there are no more pages", { hasMore: false }],
    ["the list is already long enough", { filteredItemCount: 15 }],
  ])("does not request another page when %s", (_, override) => {
    // Arrange
    const state = createPickerBackfillState();

    // Act
    const plan = planPickerBackfill({ ...baseArgs, ...override, state });

    // Assert
    expect(plan.shouldFetchMore).toBe(false);
    expect(plan.state).toBe(state);
  });
});
