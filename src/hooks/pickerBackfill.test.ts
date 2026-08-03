import {
  createPickerBackfillState,
  getPickerBackfillStatus,
  isFreshPickerBackfillState,
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

describe("getPickerBackfillStatus", () => {
  const baseArgs = {
    enabled: true,
    hasMore: true,
    filteredItemCount: 0,
  };

  it("reports backfilling while the budget is still available", () => {
    // Act
    const status = getPickerBackfillStatus({ ...baseArgs, state: createPickerBackfillState() });

    // Assert — an empty list here is premature, more pages are on the way
    expect(status).toEqual({ isBackfilling: true, isExhausted: false });
  });

  it("reports exhausted once the budget is spent with pages still available", () => {
    // Arrange
    const spent = { requestedAtRawCount: 400, requestedPages: PICKER_BACKFILL_MAX_PAGES };

    // Act
    const status = getPickerBackfillStatus({ ...baseArgs, state: spent });

    // Assert — the user has to ask for more, so the picker must not claim the catalog is empty
    expect(status).toEqual({ isBackfilling: false, isExhausted: true });
  });

  it.each([
    ["nothing is filtered out", { enabled: false }],
    ["the catalog is genuinely exhausted", { hasMore: false }],
    ["the list is already long enough", { filteredItemCount: 15 }],
  ])("reports neither state when %s", (_, override) => {
    // Arrange
    const spent = { requestedAtRawCount: 400, requestedPages: PICKER_BACKFILL_MAX_PAGES };

    // Act
    const status = getPickerBackfillStatus({ ...baseArgs, ...override, state: spent });

    // Assert
    expect(status).toEqual({ isBackfilling: false, isExhausted: false });
  });
});

describe("minRows", () => {
  const baseArgs = {
    enabled: true,
    loading: false,
    hasMore: true,
    rawItemCount: 20,
    filteredItemCount: 8,
  };

  it("leaves a short list alone when the caller renders several rows per item", () => {
    // Arrange — 8 products is plenty to scroll once each expands into variant rows
    const state = createPickerBackfillState();

    // Act
    const plan = planPickerBackfill({ ...baseArgs, state, minRows: 4 });

    // Assert — the default of 15 would have prefetched here
    expect(plan.shouldFetchMore).toBe(false);
  });

  it("still rescues a page that was filtered away entirely", () => {
    // Arrange
    const state = createPickerBackfillState();

    // Act
    const plan = planPickerBackfill({ ...baseArgs, state, filteredItemCount: 0, minRows: 4 });

    // Assert
    expect(plan.shouldFetchMore).toBe(true);
  });

  it("agrees with the status helper, so the list never sits on a spinner nothing will fill", () => {
    // Arrange — a plan that declines to fetch must not be reported as backfilling
    const state = createPickerBackfillState();

    // Act
    const plan = planPickerBackfill({ ...baseArgs, state, minRows: 4 });
    const status = getPickerBackfillStatus({ ...baseArgs, state, minRows: 4 });

    // Assert
    expect(plan.shouldFetchMore).toBe(false);
    expect(status.isBackfilling).toBe(false);
    expect(status.isExhausted).toBe(false);
  });
});

describe("isFreshPickerBackfillState", () => {
  it("recognises an untouched budget", () => {
    // Act & Assert
    expect(isFreshPickerBackfillState(createPickerBackfillState())).toBe(true);
  });

  it("recognises a spent budget", () => {
    // Act & Assert
    expect(isFreshPickerBackfillState({ requestedAtRawCount: 20, requestedPages: 1 })).toBe(false);
  });
});
