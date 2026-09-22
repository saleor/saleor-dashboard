import {
  appendUniqueOptions,
  createChoiceFetchState,
  emptyChoicesPage,
  fetchHandlerPage,
  hasSameChoiceQuery,
  hydrateChoiceCount,
  isCurrentChoiceGeneration,
  NO_MORE_CHOICES,
  pageInfoFromConnection,
  startAppendChoiceFetch,
  startReplaceChoiceFetch,
} from "./filterChoicesPage";

describe("pageInfoFromConnection", () => {
  it("reads hasNextPage and endCursor from a connection", () => {
    // Arrange
    const connection = {
      pageInfo: {
        hasNextPage: true,
        endCursor: "cursor-2",
      },
    };

    // Act
    const pageInfo = pageInfoFromConnection(connection);

    // Assert
    expect(pageInfo).toEqual({ hasNextPage: true, endCursor: "cursor-2" });
  });

  it("treats a missing connection as a complete page", () => {
    // Arrange & Act & Assert
    expect(pageInfoFromConnection(null)).toEqual(NO_MORE_CHOICES);
    expect(pageInfoFromConnection(undefined)).toEqual(NO_MORE_CHOICES);
  });
});

describe("appendUniqueOptions", () => {
  it("appends only options that are not already in the list", () => {
    // Arrange
    const existing = [{ value: "a", label: "A" }];
    const incoming = [
      { value: "a", label: "A again" },
      { value: "b", label: "B" },
    ];

    // Act
    const result = appendUniqueOptions(existing, incoming);

    // Assert
    expect(result).toEqual([
      { value: "a", label: "A" },
      { value: "b", label: "B" },
    ]);
  });
});

describe("fetchHandlerPage", () => {
  it("returns handler options and page info", async () => {
    // Arrange
    const handler = {
      pageInfo: { hasNextPage: true, endCursor: "next" },
      fetch: jest.fn().mockResolvedValue([{ value: "1", label: "One", slug: "one" }]),
    };

    // Act
    const page = await fetchHandlerPage(handler, "cursor-1");

    // Assert
    expect(handler.fetch).toHaveBeenCalledWith("cursor-1");
    expect(page).toEqual({
      options: [{ value: "1", label: "One", slug: "one" }],
      pageInfo: { hasNextPage: true, endCursor: "next" },
    });
  });

  it("uses a complete page when the handler has no page info", async () => {
    // Arrange
    const handler = {
      fetch: jest.fn().mockResolvedValue([]),
    };

    // Act
    const page = await fetchHandlerPage(handler);

    // Assert
    expect(page).toEqual(emptyChoicesPage());
  });
});

describe("choice fetch session", () => {
  it("clears the cursor so a later scroll cannot append the previous field", () => {
    // Arrange
    const state = createChoiceFetchState();

    startReplaceChoiceFetch(state, "right:0", "");
    state.pageInfo["right:0"] = { hasNextPage: true, endCursor: "attr-a" };

    // Act
    const generation = startReplaceChoiceFetch(state, "right:0", "");

    // Assert
    expect(generation).toBe(2);
    expect(state.pageInfo["right:0"]).toEqual(NO_MORE_CHOICES);
    expect(startAppendChoiceFetch(state, "right:0")).toBeNull();
  });

  it("ignores a second scroll while a page is already in flight", () => {
    // Arrange
    const state = createChoiceFetchState();

    startReplaceChoiceFetch(state, "right:0", "");
    state.pageInfo["right:0"] = { hasNextPage: true, endCursor: "cursor-1" };

    // Act
    const first = startAppendChoiceFetch(state, "right:0");
    const second = startAppendChoiceFetch(state, "right:0");

    // Assert
    expect(first).toBe(1);
    expect(second).toBeNull();
    expect(isCurrentChoiceGeneration(state, "right:0", 1)).toBe(true);
  });

  it("treats a repeated empty input as the focus fetch, not a new search", () => {
    // Arrange
    const state = createChoiceFetchState();

    startReplaceChoiceFetch(state, "right:0", "");

    // Act & Assert
    expect(hasSameChoiceQuery(state, "right:0", "")).toBe(true);
    expect(hasSameChoiceQuery(state, "right:0", "red")).toBe(false);
  });

  it("drops a debounced search after the query has already moved on", () => {
    // Arrange
    const state = createChoiceFetchState();

    startReplaceChoiceFetch(state, "right:0", "red");
    startReplaceChoiceFetch(state, "right:0", "");

    // Act & Assert
    expect(hasSameChoiceQuery(state, "right:0", "red")).toBe(false);
    expect(hasSameChoiceQuery(state, "right:0", "")).toBe(true);
  });
});

describe("hydrateChoiceCount", () => {
  it("asks for every selected id, and at least one when the list is empty", () => {
    // Arrange & Act & Assert
    expect(hydrateChoiceCount(["a", "b", "c"])).toBe(3);
    expect(hydrateChoiceCount([])).toBe(1);
  });
});
