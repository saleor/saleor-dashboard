import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { act, renderHook } from "@testing-library/react-hooks";
import { ChangeEvent } from "react";

import { useManualRefund } from "./hooks";

const fakeChangeEvent = (value: string): ChangeEvent<HTMLInputElement> =>
  ({
    target: {
      value,
    },
  }) as ChangeEvent<HTMLInputElement>;

describe("useManualRefund hook", () => {
  it("clears data after successful submit", () => {
    let submitState: ConfirmButtonTransitionState = "default";
    const { result, rerender } = renderHook(() =>
      useManualRefund({
        submitState,
        initialData: {
          amount: 12,
          description: "test",
          pspReference: "test-1234",
        },
      }),
    );

    expect(result.current.amount).toBe(12);
    expect(result.current.description).toBe("test");
    expect(result.current.pspReference).toBe("test-1234");
    submitState = "loading";
    rerender();
    submitState = "success";
    rerender();
    expect(result.current.amount).toBe(undefined);
    expect(result.current.description).toBe("");
    expect(result.current.pspReference).toBe(undefined);
  });
  it("updates amount after user changes form input", () => {
    const { result } = renderHook(() =>
      useManualRefund({
        submitState: "default",
      }),
    );

    expect(result.current.amount).toBe(undefined);
    act(() => {
      result.current.handleChangeAmount(fakeChangeEvent("12.00"));
    });
    expect(result.current.amount).toBe(12);
    // clears value when cannot parse
    act(() => {
      result.current.handleChangeAmount(fakeChangeEvent("abcde"));
    });
    expect(result.current.amount).toBe(undefined);
  });
  it("updates description after user changes form input", () => {
    const { result } = renderHook(() =>
      useManualRefund({
        submitState: "default",
      }),
    );

    expect(result.current.description).toBe("");
    act(() => {
      result.current.handleChangeDescription(fakeChangeEvent("new-description"));
    });
    expect(result.current.description).toBe("new-description");
  });
  it("updates psp reference after user changes form input", () => {
    const { result } = renderHook(() =>
      useManualRefund({
        submitState: "default",
      }),
    );

    expect(result.current.pspReference).toBe(undefined);
    act(() => {
      result.current.handleChangePspReference(fakeChangeEvent("test-1234"));
    });
    expect(result.current.pspReference).toBe("test-1234");
  });
});
