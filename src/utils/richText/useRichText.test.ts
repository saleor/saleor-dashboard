import { OutputData } from "@editorjs/editorjs";
import { renderHook } from "@testing-library/react-hooks";

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
    // eslint-disable-next-line prefer-const
    let initial: string | undefined;
    let loading = true;
    const { result, rerender } = renderHook(() =>
      useRichText({ initial, loading, triggerChange }),
    );

    expect(result.current.isReadyForMount).toBe(false);

    initial = JSON.stringify(fixtures.short); // for JSON.parse()
    loading = false;
    rerender();

    expect(result.current.defaultValue).toStrictEqual(fixtures.short);
    expect(result.current.isReadyForMount).toBe(true);
  });

  it("returns undefined when JSON cannot be parsed", () => {
    // eslint-disable-next-line prefer-const
    let initial: string | undefined;
    let loading = true;
    const { result, rerender } = renderHook(() =>
      useRichText({ initial, loading, triggerChange }),
    );

    expect(result.current.isReadyForMount).toBe(false);

    initial = "this-isnt-valid-json";
    loading = false;
    rerender();

    expect(result.current.defaultValue).toBe(undefined);
    expect(result.current.isReadyForMount).toBe(false);
  });

  it("runs editorJS .save() when getValue is called", async () => {
    const saveFn = jest.fn(async () => fixtures.short);
    const { result } = renderHook(() =>
      useRichText({ initial: "", triggerChange }),
    );
    result.current.editorRef.current = {
      save: saveFn,
      destroy: jest.fn(),
      clear: jest.fn(),
      render: jest.fn(),
    };

    expect(await result.current.getValue()).toStrictEqual(fixtures.short);
    expect(saveFn).toHaveBeenCalled();
  });

  it("calls triggerChange when change is made in the editor", () => {
    triggerChange.mockClear();
    const { result } = renderHook(() =>
      useRichText({ initial: "", triggerChange }),
    );

    result.current.handleChange();

    expect(triggerChange).toHaveBeenCalled();
  });
});
