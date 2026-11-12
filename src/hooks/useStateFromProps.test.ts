import { act, renderHook } from "@testing-library/react";

import useStateFromProps from "./useStateFromProps";

function setupHook() {
  return renderHook(useStateFromProps, {
    initialProps: {
      a: 0,
    },
  });
}

describe("useStateFromProps", () => {
  it("updates itself if props changed", () => {
    const hook = setupHook();

    hook.rerender({ a: 1 });
    expect(hook.result.current[0].a).toBe(1);
  });
  it("updates if called setState", () => {
    const hook = setupHook();

    act(() => hook.result.current[1]({ a: 1 }));
    expect(hook.result.current[0].a).toBe(1);
  });
  it("does not update if props stay the same", () => {
    const hook = setupHook();

    act(() => hook.result.current[1]({ a: 1 }));
    hook.rerender({ a: 0 });
    expect(hook.result.current[0].a).toBe(1);
  });
  it("update if called setState and then props changed", () => {
    const hook = setupHook();

    act(() => hook.result.current[1]({ a: 1 }));
    hook.rerender({ a: 2 });
    expect(hook.result.current[0].a).toBe(2);
  });

  describe("resetKey", () => {
    const setupResettableHook = () =>
      renderHook(
        ({ data, resetKey }: { data: { a: number }; resetKey: number }) =>
          useStateFromProps(data, { resetKey }),
        { initialProps: { data: { a: 0 }, resetKey: 0 } },
      );

    it("drops a draft when the key changes, even if the props stay the same", () => {
      // Arrange
      const hook = setupResettableHook();

      act(() => hook.result.current[1]({ a: 1 }));

      // Act
      hook.rerender({ data: { a: 0 }, resetKey: 1 });

      // Assert
      expect(hook.result.current[0].a).toBe(0);
    });

    it("keeps a draft while the key stays the same", () => {
      // Arrange
      const hook = setupResettableHook();

      act(() => hook.result.current[1]({ a: 1 }));

      // Act
      hook.rerender({ data: { a: 0 }, resetKey: 0 });

      // Assert
      expect(hook.result.current[0].a).toBe(1);
    });

    it("drops drafts a merge would keep when the props change together with the key", () => {
      // Arrange
      type Data = { a: number; b: number };

      // Keeps the state's value for every key whose prop didn't change, like forms do.
      const keepUnchangedDrafts = (prevData: Data, state: Data, data: Data): Data => ({
        a: data.a === prevData.a ? state.a : data.a,
        b: data.b === prevData.b ? state.b : data.b,
      });
      const hook = renderHook(
        ({ data, resetKey }: { data: Data; resetKey: number }) =>
          useStateFromProps(data, { mergeFunc: keepUnchangedDrafts, resetKey }),
        { initialProps: { data: { a: 0, b: 0 }, resetKey: 0 } },
      );

      act(() => hook.result.current[1]({ a: 1, b: 1 }));

      // Act
      hook.rerender({ data: { a: 0, b: 2 }, resetKey: 1 });

      // Assert
      expect(hook.result.current[0]).toEqual({ a: 0, b: 2 });
    });
  });
});
