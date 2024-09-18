import { renderHook } from "@testing-library/react-hooks";

import { useNavigatorOnline } from "./useNavigatorOnline";

describe("useNavigatorOnline", () => {
  it("should return true when online", () => {
    const navigator = { onLine: true } as Navigator;

    const { result } = renderHook(() => useNavigatorOnline(navigator));

    expect(result.current).toBe(true);
  });

  it("should return false when offline", () => {
    const navigator = { onLine: false } as Navigator;

    const { result } = renderHook(() => useNavigatorOnline(navigator));

    expect(result.current).toBe(false);
  });
});
