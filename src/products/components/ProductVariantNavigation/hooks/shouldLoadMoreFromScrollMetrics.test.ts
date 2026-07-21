import { shouldLoadMoreFromScrollMetrics } from "./shouldLoadMoreFromScrollMetrics";

describe("shouldLoadMoreFromScrollMetrics", () => {
  const base = {
    hasNextPage: true,
    loadingMore: false,
    maxHeightPx: 800 as number | null,
  };

  it("does not load when there is no next page", () => {
    // Arrange / Act / Assert
    expect(
      shouldLoadMoreFromScrollMetrics({
        ...base,
        hasNextPage: false,
        scrollHeight: 200,
        scrollTop: 0,
        clientHeight: 200,
        userScroll: false,
      }),
    ).toBe(false);
  });

  it("does not load while a fetch is already in flight", () => {
    expect(
      shouldLoadMoreFromScrollMetrics({
        ...base,
        loadingMore: true,
        scrollHeight: 200,
        scrollTop: 0,
        clientHeight: 200,
        userScroll: false,
      }),
    ).toBe(false);
  });

  it("does not auto-fill when the box is unbounded (no max-height)", () => {
    // This is the bug: sticky/unconstrained column grows with content, so
    // scrollHeight === clientHeight forever and we'd walk every page.
    expect(
      shouldLoadMoreFromScrollMetrics({
        ...base,
        maxHeightPx: null,
        scrollHeight: 4000,
        scrollTop: 0,
        clientHeight: 4000,
        userScroll: false,
      }),
    ).toBe(false);
  });

  it("auto-fills when content is shorter than a bounded viewport", () => {
    expect(
      shouldLoadMoreFromScrollMetrics({
        ...base,
        maxHeightPx: 800,
        scrollHeight: 200,
        scrollTop: 0,
        clientHeight: 200,
        userScroll: false,
      }),
    ).toBe(true);
  });

  it("does not auto-fill once content overflows the bounded viewport", () => {
    expect(
      shouldLoadMoreFromScrollMetrics({
        ...base,
        maxHeightPx: 800,
        scrollHeight: 2000,
        scrollTop: 0,
        clientHeight: 800,
        userScroll: false,
      }),
    ).toBe(false);
  });

  it("loads on user scroll when near the bottom", () => {
    expect(
      shouldLoadMoreFromScrollMetrics({
        ...base,
        scrollHeight: 2000,
        scrollTop: 1150,
        clientHeight: 800,
        userScroll: true,
      }),
    ).toBe(true);
  });

  it("does not load on user scroll when far from the bottom", () => {
    expect(
      shouldLoadMoreFromScrollMetrics({
        ...base,
        scrollHeight: 2000,
        scrollTop: 0,
        clientHeight: 800,
        userScroll: true,
      }),
    ).toBe(false);
  });

  it("allows user-scroll load even without max-height", () => {
    expect(
      shouldLoadMoreFromScrollMetrics({
        ...base,
        maxHeightPx: null,
        scrollHeight: 2000,
        scrollTop: 1150,
        clientHeight: 800,
        userScroll: true,
      }),
    ).toBe(true);
  });
});
