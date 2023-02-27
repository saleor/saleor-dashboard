import { act, renderHook } from "@testing-library/react-hooks";

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
});
