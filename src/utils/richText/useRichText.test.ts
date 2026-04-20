import { type OutputData } from "@editorjs/editorjs";
import { act, renderHook } from "@testing-library/react";

import useRichText from "./useRichText";

type Fixtures = Record<"short", OutputData>;

const fixtures: Fixtures = {
  short: {
    blocks: [
      {
        data: {
          text: "Some text",
        },
        type: "paragraph",
      },
    ],
  },
};
const triggerChange = jest.fn();

describe("useRichText", () => {
  it("properly informs RichTextEditor when data is ready to mount", () => {
    const { result, rerender } = renderHook(
      ({ initial, loading }) => useRichText({ initial, loading, triggerChange }),
      { initialProps: { initial: undefined as string | undefined, loading: true } },
    );

    expect(result.current.isReadyForMount).toBe(false);
    rerender({ initial: JSON.stringify(fixtures.short), loading: false });
    expect(result.current.defaultValue).toStrictEqual(fixtures.short);
    expect(result.current.isReadyForMount).toBe(true);
    expect(result.current.isDirty).toBe(false);
  });
  it("returns undefined when JSON cannot be parsed", () => {
    const { result, rerender } = renderHook(
      ({ initial, loading }) => useRichText({ initial, loading, triggerChange }),
      { initialProps: { initial: undefined as string | undefined, loading: true } },
    );

    expect(result.current.isReadyForMount).toBe(false);
    rerender({ initial: "this-isnt-valid-json", loading: false });
    expect(result.current.defaultValue).toBe(undefined);
    expect(result.current.isReadyForMount).toBe(false);
    expect(result.current.isDirty).toBe(false);
  });
  it("runs editorJS .save() when getValue is called", async () => {
    const saveFn = jest.fn(async () => fixtures.short);
    const { result } = renderHook(() => useRichText({ initial: "", triggerChange }));

    result.current.editorRef.current = {
      save: saveFn,
      destroy: jest.fn(),
      clear: jest.fn(),
      render: jest.fn(),
      dangerouslyLowLevelInstance: {},
    };
    expect(await result.current.getValue()).toStrictEqual(fixtures.short);
    expect(saveFn).toHaveBeenCalled();
    expect(result.current.isDirty).toBe(false);
  });
  it("calls triggerChange when change is made in the editor", () => {
    triggerChange.mockClear();

    const { result } = renderHook(() => useRichText({ initial: "", triggerChange }));

    act(() => {
      result.current.handleChange();
    });
    expect(triggerChange).toHaveBeenCalled();
    expect(result.current.isDirty).toBe(true);
  });
});
