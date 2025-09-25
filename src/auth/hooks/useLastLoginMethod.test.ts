import { act, renderHook } from "@testing-library/react-hooks";

import { useLastLoginMethod } from "./useLastLoginMethod";

describe("useLastLoginMethod", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns false when last login method is not stored", () => {
    const { result } = renderHook(() => useLastLoginMethod());

    expect(result.current.hasUserLoggedViaExternalMethod).toBe(false);
  });

  it("returns false when last login method is password", () => {
    const { result } = renderHook(() => useLastLoginMethod());

    act(() => {
      result.current.setLastLoginMethod("password");
    });

    expect(result.current.hasUserLoggedViaExternalMethod).toBe(false);
  });

  it("returns true when last login method is external", () => {
    const { result } = renderHook(() => useLastLoginMethod());

    act(() => {
      result.current.setLastLoginMethod("external-provider");
    });

    expect(result.current.hasUserLoggedViaExternalMethod).toBe(true);
  });
});
