import { act, renderHook } from "@testing-library/react";

import { useLastCreatedEntityTypeStorage } from "./useLastCreatedEntityTypeStorage";

beforeEach(() => {
  localStorage.clear();
});

describe("useLastCreatedEntityTypeStorage", () => {
  it("returns null when nothing is stored", () => {
    const { result } = renderHook(() => useLastCreatedEntityTypeStorage("MODEL"));

    expect(result.current[0]).toBeNull();
  });

  it("persists the id to localStorage under a namespaced key", () => {
    const { result } = renderHook(() => useLastCreatedEntityTypeStorage("MODEL"));

    act(() => {
      result.current[1]("page-type-1");
    });

    expect(result.current[0]).toBe("page-type-1");
    expect(localStorage.getItem("lastCreatedEntityType:MODEL")).toBe("page-type-1");
  });

  it("reads previously stored id on init", () => {
    localStorage.setItem("lastCreatedEntityType:MODEL", "page-type-2");

    const { result } = renderHook(() => useLastCreatedEntityTypeStorage("MODEL"));

    expect(result.current[0]).toBe("page-type-2");
  });
});
